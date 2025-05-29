import ToHomePageButton from "./ToHomePageButton";
import { useHeaderHeight } from "../context/HeaderHeightContext";

const TableOfContents = ({ sections }) => {
  const headerHeight = useHeaderHeight();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = headerHeight + 30; // ヘッダーの高さと余白を考慮
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="toc-container" style={{ top: `${headerHeight + 30}px` }}>
      <nav className="toc">
        <h2>目次</h2>
        <ul className="toc-list">
          {sections.map((section, index) => (
            <div key={section.id}>
              {index !== 0 && <div className="toc-divider" />}
              <li className="toc-item">
                <button
                  onClick={() => scrollToSection(section.id)}>
                  {section.title}
                </button>
              </li>
            </div>
          ))}
        </ul>
      </nav>
      <ToHomePageButton />
    </div>
  )
};

export default TableOfContents;
