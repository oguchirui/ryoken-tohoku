

const AboutContent = ({ sections }) => {
  return (
    <div className="about-content">
      {sections.map((section) => (
        <section
          className="about-content-section"
          id={section.id}
          key={section.id}>
          <h2>{section.title}</h2>
          {section.content}
        </section>
      ))}
    </div>
  );
};

export default AboutContent;
