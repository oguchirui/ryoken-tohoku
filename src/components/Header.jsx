import { useEffect, useRef } from 'react'
import ToAboutPageButton from "./ToAboutPageButton";

const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    const adjustBodyMargin = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.body.style.marginTop = `${headerHeight + 30}px`;
      }
    };

    adjustBodyMargin();
    window.addEventListener('resize', adjustBodyMargin);

    return () => {
      window.removeEventListener('resize', adjustBodyMargin);
    };
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <h1 className="header-title">東北大学 旅行研究会 活動記録</h1>
      <nav className="nav">
        <ToAboutPageButton />
        <button>
          パスワード再設定
        </button>
      </nav>
    </header>
  );
};

export default Header;
