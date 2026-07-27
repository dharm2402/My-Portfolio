import './About.css'

function About() {
  return (
    <section className="content-section about-section">
      <div className="about-header">
        <h1 className="about-title">Vaghasiya Dharm</h1>
        <p className="about-subtitle">AI & Machine Learning Enthusiast | Full-Stack Developer</p>
      </div>

      <div className="about-content">
        <div className="about-intro">
          <p className="about-text">
            I am a dedicated <span className="highlight">Artificial Intelligence & Machine Learning</span> student with a strong passion for developing innovative, data-driven solutions and continuously expanding my technical expertise.
          </p>
        </div>

        <div className="about-section-item">
          <h3 className="about-section-title">Interests & Focus Areas</h3>
          <p className="about-text">
            My interests include <span className="highlight">Machine Learning, Deep Learning, Data Science, Artificial Intelligence, and Full-Stack Web Development</span>, where I enjoy transforming ideas into practical applications through real-world projects.
          </p>
        </div>

        <div className="about-section-item">
          <h3 className="about-section-title">Expertise & Experience</h3>
          <p className="about-text">
            I have hands-on experience with <span className="highlight">Python, Machine Learning frameworks, Data Analysis, Web Development, and Database Management</span>, enabling me to build intelligent and scalable software solutions.
          </p>
        </div>

        <div className="about-section-item">
          <h3 className="about-section-title">Professional Goals</h3>
          <p className="about-text">
            I am a quick learner with strong analytical and problem-solving abilities, committed to writing efficient, maintainable code while staying up to date with emerging technologies and industry best practices.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
