import ToHomePageButton from "@/components/changePageButtons/ToHomePageButton";
import { useHeaderHeight } from "@/contexts/HeaderHeightContext";

/**
 * TableOfContents コンポーネント
 * 
 * 「このサイトについて」ページの目次（Table of Contents）を表示。
 * 各目次項目をクリックすると該当セクションへスムーズにスクロール。
 * 階層構造に対応し、子項目もネストして表示。
 * 
 * @param {Array} sections - セクション情報の配列（id, title, children を含む）
 * @returns {JSX.Element} 目次表示部分
 */
const TableOfContents = ({ sections }) => {
  const headerHeight = useHeaderHeight(); // ヘッダーの高さ（動的）

  const isMobile = window.innerWidth <= 768; // モバイル判定
  const marginTop = isMobile ? 15 : 30; // ヘッダー下のマージン（デバイスによって調整）

  /**
   * 指定されたセクションまでスムーズにスクロールする関数
   * ヘッダーの高さとマージンを考慮してスクロール位置を計算
   * 
   * @param {string} id - スクロール先のセクションの ID
   */
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = headerHeight + marginTop;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  /**
   * 階層付きリストを再帰的に描画
   * 
   * @param {Array} items - セクション配列
   * @param {number} depth - 階層の深さ（スタイル用に使用）
   * @returns {JSX.Element} 階層付きリスト
   */
  const renderList = (items, depth = 1) => (
    <ul className={`toc-list depth-${depth}`}>
      {items.map((item, index) => (
        <div key={item.id}>
          {/* 各項目の前に区切り線を表示（1項目目以外） */}
          {index !== 0 && <div className="toc-divider" />}

          <li className={`toc-item depth-${depth}`}>
            {/* ボタンで該当セクションにスクロール */}
            <button onClick={() => scrollToSection(item.id)}>
              {item.title}
            </button>

            {/* 子セクションがあれば区切り線とリストを再帰描画 */}
            {item.children && <div className="toc-divider" />}
            {item.children && renderList(item.children, depth + 1)}
          </li>
        </div>
      ))}
    </ul>
  );

  return (
    <div className="toc-container" style={{ top: `${headerHeight + marginTop}px` }}>
      {/* 目次ナビゲーション */}
      <nav className="toc">
        <h2>目次</h2>
        {renderList(sections)}
      </nav>

      {/* モバイル以外ではホームへ遷移するボタンを表示 */}
      {isMobile || <ToHomePageButton />}
    </div>
  );
};

export default TableOfContents;
