import { useState, useEffect } from 'react'
import './Projects.css'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

function ProjectsPage() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/users/dharm2402/repos')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page-stack">
      <div className="content-section">
        <h2>GitHub Repositories</h2>
        {loading && <Spinner />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <div className="project-list">
            {repos.map((repo) => (
              <article key={repo.id} className="project-card">
                <h3>
                  <a href={repo.html_url} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                </h3>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectsPage