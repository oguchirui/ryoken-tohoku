import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop.jsx
 * ページ遷移時にスクロール位置をトップに戻すためのコンポーネント。
 * useLocation フックを使用して、現在のパスが変わるたびにスクロール位置をリセットします。
 * 
 * @returns {JSX.Element|null} null（何も表示しない）
 */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // パスが変わるたびにスクロール位置をトップに戻す
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
