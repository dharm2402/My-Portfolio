const API = '/tasks';

// ── Load all tasks ────────────────────────────────────────────────────────────
async function loadTasks() {
  const res  = await fetch(API);
  const data = await res.json();
  renderCards(data.tasks);
  updateStats(data.tasks);
}

// ── Render task cards ─────────────────────────────────────────────────────────
function renderCards(tasks) {
  const list  = document.getElementById('taskList');
  const empty = document.getElementById('emptyState');
  list.innerHTML = '';

  if (!tasks || tasks.length === 0) {
    list.appendChild(empty);
    empty.style.display = 'block';
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement('div');
    card.className = `task-card${task.completed ? ' completed' : ''}`;
    card.id = `card-${task.id}`;
    card.innerHTML = `
      <div class="task-id">#${task.id}</div>
      <div class="task-body">
        <div class="task-title" id="title-${task.id}">${escapeHtml(task.title)}</div>
      </div>
      <span class="badge ${task.completed ? 'completed' : 'pending'}" id="badge-${task.id}">
        ${task.completed ? '✓ Done' : '● Pending'}
      </span>
      <div class="task-actions" id="actions-${task.id}">
        <button class="btn-sm btn-edit"   onclick="enterEditMode(${task.id}, '${escapeJs(task.title)}', ${task.completed})">✎ Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteTask(${task.id})">✕ Delete</button>
      </div>
    `;
    list.appendChild(card);
  });
}

// ── Update sidebar stats ──────────────────────────────────────────────────────
function updateStats(tasks) {
  const total   = tasks ? tasks.length : 0;
  const done    = tasks ? tasks.filter((t) => t.completed).length : 0;
  const pending = total - done;
  document.getElementById('statTotal').textContent   = total;
  document.getElementById('statDone').textContent    = done;
  document.getElementById('statPending').textContent = pending;
}

// ── Enter inline edit mode ────────────────────────────────────────────────────
function enterEditMode(id, currentTitle, currentCompleted) {
  document.getElementById(`title-${id}`).innerHTML = `
    <input type="text" id="edit-title-${id}" value="${escapeHtml(currentTitle)}" class="inline-input" />
  `;

  document.getElementById(`badge-${id}`).innerHTML = `
    <select id="edit-status-${id}" class="inline-select">
      <option value="false" ${!currentCompleted ? 'selected' : ''}>Pending</option>
      <option value="true"  ${currentCompleted  ? 'selected' : ''}>Done</option>
    </select>
  `;

  document.getElementById(`actions-${id}`).innerHTML = `
    <button class="btn-sm btn-save"   onclick="saveUpdate(${id})">✓ Save</button>
    <button class="btn-sm btn-cancel" onclick="loadTasks()">✕ Cancel</button>
  `;

  document.getElementById(`edit-title-${id}`).focus();
}

// ── Save updated task ─────────────────────────────────────────────────────────
async function saveUpdate(id) {
  const title     = document.getElementById(`edit-title-${id}`).value.trim();
  const completed = document.getElementById(`edit-status-${id}`).value === 'true';

  if (!title) { alert('Task title cannot be empty.'); return; }

  const res = await fetch(`${API}/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ title, completed }),
  });

  if (res.ok) {
    loadTasks();
  } else {
    const err = await res.json();
    alert('Error: ' + (err.message || 'Could not update task'));
  }
}

// ── Add task ──────────────────────────────────────────────────────────────────
async function addTask() {
  const titleInput     = document.getElementById('taskTitle');
  const completedInput = document.getElementById('taskCompleted');
  const title          = titleInput.value.trim();

  if (!title) { titleInput.focus(); return; }

  const res = await fetch(API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ title, completed: completedInput.checked }),
  });

  if (res.ok) {
    titleInput.value       = '';
    completedInput.checked = false;
    titleInput.focus();
    loadTasks();
  } else {
    const err = await res.json();
    alert('Error: ' + (err.message || 'Could not add task'));
  }
}

// ── Delete task ───────────────────────────────────────────────────────────────
async function deleteTask(id) {
  if (!confirm(`Delete task #${id}?`)) return;

  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });

  if (res.ok) {
    loadTasks();
  } else {
    const err = await res.json();
    alert('Error: ' + (err.message || 'Could not delete task'));
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// Escape for JS string literals inside onclick="..."
function escapeJs(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadTasks();
