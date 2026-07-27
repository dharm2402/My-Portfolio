import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [message, setMessage] = useState('')
  const [submittedName, setSubmittedName] = useState('')

  return (
    <section className="page-stack">
      <div className="content-section">
        <h2>Contact Me</h2>
        <p>Share your thoughts and I will get back to you soon.</p>
        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          className="form-input"
          type="text"
          value={submittedName}
          onChange={(event) => setSubmittedName(event.target.value)}
          placeholder="Enter your name"
        />
        <label className="form-label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          className="form-input"
          rows="4"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your message"
        />
        <p className="form-preview">
          Preview: {submittedName || 'Your name'} says, “{message || 'Your message will appear here'}”
        </p>
      </div>
    </section>
  )
}

export default Contact
