import { useEffect, useRef } from 'react'
import { useChangePasswordDispatch } from '../context/ChangePasswordContext';
import ToAboutPageButton from "./ToAboutPageButton";

const Header = () => {
  const headerRef = useRef(null);

  const changePasswordDispatch = useChangePasswordDispatch();

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

  const handleChangePassword = () => {
    changePasswordDispatch({ type: 'open' });
  };

  return (
    <header className="header" ref={headerRef}>
      <h1 className="header-title">東北大学 旅行研究会 活動記録</h1>
      <nav className="nav">
        <ToAboutPageButton />
        <button onClick={handleChangePassword}>パスワード再設定</button>
      </nav>
    </header>
  );
};

export default Header;
