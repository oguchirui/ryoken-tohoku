import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useChangePasswordDispatch } from '@/contexts/ChangePasswordContext';
import { useSetHeaderHeight } from '@/contexts/HeaderHeightContext';
import ToAboutPageButton from "@/components/changePageButtons/ToAboutPageButton";

/**
 * ヘッダーコンポーネント。
 * ページタイトルとナビゲーションボタンを表示。
 * 
 * @returns {JSX.Element} ヘッダーコンポーネント
 */

const Header = () => {
  const headerRef = useRef(null); // ヘッダーの高さを取得するための参照

  const navigate = useNavigate(); // ページ遷移のためのフック

  const changePasswordDispatch = useChangePasswordDispatch(); // パスワード変更モーダルの開閉制御用の dispatch 関数

  const setHeaderHeight = useSetHeaderHeight(); // ヘッダーの高さをコンテキストに記録するための関数

  useEffect(() => {
    // ヘッダーの高さに応じて、body の margin-top を調整する関数
    const adjustBodyMargin = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;

        // ヘッダーの高さをグローバルコンテキストに記録
        setHeaderHeight(headerHeight);

        // 画面サイズに応じて余白を変える（モバイルとPCで分岐）
        const isMobile = window.innerWidth <= 768;
        const marginTop = isMobile ? 15 : 30;

        // body に marginTop を直接適用して、上に被らないように調整
        document.body.style.marginTop = `${headerHeight + marginTop}px`;
      }
    };

    // 初回マウント時と、リサイズ時に実行
    adjustBodyMargin();
    window.addEventListener('resize', adjustBodyMargin);

    // コンポーネントがアンマウントされたときにイベントリスナーを解除
    return () => {
      window.removeEventListener('resize', adjustBodyMargin);
    };
  }, []); // 初回マウント時のみ実行

  // 「パスワード再設定」ボタンが押されたときにモーダルを開く処理
  const handleChangePassword = () => {
    changePasswordDispatch({ type: 'open' });
  };

  return (
    // ヘッダー全体（DOMに高さを測るために ref を付与）
    <header className="header" ref={headerRef}>
      
      {/* タイトル部分：クリックするとホームに戻る */}
      <h1
        className="header-title"
        onClick={() => {
          navigate('/'); // ルートパスに遷移
        }}
      >
        東北大学 旅行研究会 活動記録
      </h1>

      {/* ナビゲーション部分（Aboutページへの遷移ボタンとパスワード変更ボタン） */}
      <nav className="nav">
        <ToAboutPageButton />
        <button onClick={handleChangePassword}>パスワードの再設定</button>
      </nav>
    </header>
  );
};

export default Header;
