function Projects({ projects }) {
  return (
    <section className="content-section">
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <article key={project.name} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
