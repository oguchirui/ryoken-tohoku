const AboutSections = ({ sections }) => {
  const renderSections = (items, depth = 1) => (
    <>
      {items.map((item) => {
        const HeadingTag = `h${Math.min(depth + 1, 6)}`;

        return (
          <section
            className={`about-section depth-${depth}`}
            id={item.id}
            key={item.id}
          >
            <HeadingTag className={`heading depth-${depth}`}>
              {item.title}
            </HeadingTag>
            <div className={`about-content depth-${depth}`}>
              {item.content}
            </div>
            {item.children && renderSections(item.children, depth + 1)}
          </section>
        );
      })}
    </>
  );

  return (
    <div className="about-section-container">
      {renderSections(sections)}
    </div>
  );
};

export default AboutSections;
