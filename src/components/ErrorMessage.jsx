import './ErrorMessage.css'

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <p>Something went wrong while loading repositories.</p>
      <p className="error-detail">{message}</p>
    </div>
  )
}

export default ErrorMessage