import './Skills.css'

function SkillsPage() {
  const skillsData = [
    {
      category: "Programming Languages",
      items: ["Python", "Java", "C"]
    },
    {
      category: "Web Development",
      items: ["HTML", "CSS", "JavaScript", "React"]
    },
    {
      category: "Artificial Intelligence",
      items: ["Generative AI", "Prompt Engineering", "AI Fundamentals"]
    },
    {
      category: "Machine Learning",
      items: ["Supervised Learning", "Unsupervised Learning", "Deep Learning (ANN, CNN)", "Classification", "Regression", "Clustering", "Feature Engineering", "Data Preprocessing", "Model Evaluation", "TensorFlow", "Keras", "Scikit-learn"]
    },
    {
      category: "Data Science & Data Analysis",
      items: ["Pandas", "NumPy", "Data Cleaning", "EDA", "Data Visualization", "Statistical Analysis", "Matplotlib", "Seaborn"]
    },
    {
      category: "Databases",
      items: ["MySQL", "MongoDB"]
    },
    {
      category: "Tools",
      items: ["Git", "GitHub", "VS Code", "Jupyter Notebook", "Google Colab", "Power BI"]
    },
    {
      category: "Soft Skills",
      items: ["Problem Solving", "Teamwork", "Communication", "Critical Thinking", "Continuous Learning"]
    }
  ];

  return (
    <section className="content-section">
      <h2>Skills</h2>
      <div className="skills-container">
        {skillsData.map((skillGroup, index) => (
          <div key={index} className="skill-category">
            <h3>{skillGroup.category}</h3>
            <ul className="skill-list">
              {skillGroup.items.map((skill, itemIndex) => (
                <li key={itemIndex}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkillsPage;
