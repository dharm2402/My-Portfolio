import './Spinner.css'

function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <p>Loading repositories...</p>
    </div>
  )
}

export default Spinner