import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useChangePasswordDispatch } from '../context/ChangePasswordContext';
import { useSetHeaderHeight } from '../context/HeaderHeightContext';
import ToAboutPageButton from "./ToAboutPageButton";

const Header = () => {
  const headerRef = useRef(null);

  const navigate = useNavigate();

  const changePasswordDispatch = useChangePasswordDispatch();

  const setHeaderHeight = useSetHeaderHeight();

  useEffect(() => {
    const adjustBodyMargin = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        setHeaderHeight(headerHeight);

        const isMobile = window.innerWidth <= 768;
        const marginTop = isMobile ? 15 : 30

        document.body.style.marginTop = `${headerHeight + marginTop}px`;
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
      <h1
        className="header-title"
        onClick={() => {
          navigate('/');
        }}>
        東北大学 旅行研究会 活動記録
      </h1>
      <nav className="nav">
        <ToAboutPageButton />
        <button onClick={handleChangePassword}>パスワードの再設定</button>
      </nav>
    </header>
  );
};

export default Header;
