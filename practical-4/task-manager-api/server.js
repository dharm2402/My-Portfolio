const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';
const DB_NAME = process.env.MONGO_DB_NAME || 'taskManagerDB';

let tasksCollection;
let countersCollection;

// ─── Database Initialization ────────────────────────────────────────────────
async function initDb() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  tasksCollection = db.collection('tasks');
  countersCollection = db.collection('counters');

  await countersCollection.updateOne(
    { _id: 'taskid' },
    { $setOnInsert: { seq: 0 } },
    { upsert: true }
  );

  console.log(`Connected to MongoDB at ${MONGO_URI} using database ${DB_NAME}`);
}

async function getNextTaskId() {
  const result = await countersCollection.findOneAndUpdate(
    { _id: 'taskid' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  if (!result.value) {
    const fallback = await countersCollection.findOne({ _id: 'taskid' });
    if (!fallback) {
      throw new Error('Failed to generate task ID');
    }
    return fallback.seq;
  }

  return result.value.seq;
}

// ─── Serve Static Frontend ───────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Body Parser ────────────────────────────────────────────────────────────
// Must come first so req.body is available on all POST/PUT routes.
app.use(express.json());

// ─── Middleware 1: Request Logger ────────────────────────────────────────────
// Logs HTTP method, URL, and timestamp for every incoming request.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── Middleware 2: Content-Type guard for POST / PUT ─────────────────────────
// Supplementary Problem 1 — reject API requests that are missing the header.
app.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method) && req.path.startsWith('/tasks')) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json for POST and PUT requests.',
      });
    }
  }
  next();
});

// ─── Route-specific Middleware: ID Validator ─────────────────────────────────
// Supplementary Problem 2 — validates that :id is a positive integer.
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Task ID must be a positive integer. Received: "${req.params.id}"`,
    });
  }
  req.taskId = id; // attach parsed id for downstream handlers
  next();
};

// ─── CRUD Routes ─────────────────────────────────────────────────────────────

// GET /tasks — return all tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await tasksCollection.find({ isDeleted: { $ne: true } }).sort({ id: 1 }).toArray();
    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
});

// POST /tasks — create a new task
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Bad Request', message: 'title is required.' });
    }

    const id = await getNextTaskId();
    const task = {
      id,
      title,
      description: description || '',
      completed: Boolean(completed),
      createdAt: new Date().toISOString(),
      updatedAt: null,
      deletedAt: null,
      isDeleted: false,
    };

    await tasksCollection.insertOne(task);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id — update an existing task
app.put('/tasks/:id', validateId, async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const update = {};

    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (completed !== undefined) update.completed = completed;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Request body must contain at least one field to update.',
      });
    }

    const result = await tasksCollection.findOneAndUpdate(
      { id: req.taskId, isDeleted: { $ne: true } },
      { $set: { ...update, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with id ${req.taskId} does not exist.`,
      });
    }

    res.status(200).json({ task: result.value });
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id — remove a task
app.delete('/tasks/:id', validateId, async (req, res, next) => {
  try {
    const update = {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await tasksCollection.findOneAndUpdate(
      { id: req.taskId, isDeleted: { $ne: true } },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with id ${req.taskId} does not exist.`,
      });
    }

    res.status(200).json({ message: 'Task deleted successfully.', task: result.value });
  } catch (err) {
    next(err);
  }
});

// ─── TEMPORARY: Crash Test Route ──────────────────────────────────────────────
app.get('/crash-test', (req, res) => {
  const x = undefined;
  x.crash();
});

// ─── 404 Handler for Undefined Routes ────────────────────────────────────────
// Supplementary Problem 3 — structured JSON response for unknown paths.
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} does not exist on this server.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must be defined LAST — Express identifies it by the 4-argument signature.
// Logs the full stack internally but never exposes it to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Task Manager API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
