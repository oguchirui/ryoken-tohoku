import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // パスが変わるたびにスクロール位置をトップに戻す
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
