import ToHomePageButton from "./ToHomePageButton";
import { useHeaderHeight } from "../context/HeaderHeightContext";

const TableOfContents = ({ sections }) => {
  const headerHeight = useHeaderHeight();

  const isMobile = window.innerWidth <= 768;
  const marginTop = isMobile ? 15 : 30;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = headerHeight + marginTop; // ヘッダーの高さと余白を考慮
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const renderList = (items, depth = 1) => (
    <ul className={`toc-list depth-${depth}`}>
      {items.map((item, index) => (
        <div key={item.id}>
          {index !== 0 && <div className="toc-divider" />}
          <li className={`toc-item depth-${depth}`}>
            <button
              onClick={() => scrollToSection(item.id)}>
              {item.title}
            </button>
            {item.children && <div className="toc-divider" />}
            {item.children && renderList(item.children, depth + 1)}
          </li>
        </div>
      ))}
    </ul>
  )

  return (
    <div className="toc-container" style={{ top: `${headerHeight + marginTop}px` }}>
      <nav className="toc">
        <h2>目次</h2>
        {renderList(sections)}
      </nav>
      {isMobile || <ToHomePageButton />}
    </div>
  )
};

export default TableOfContents;
