/**
 * AboutSections コンポーネント
 * 
 * 「このサイトについて」ページ内の各セクションを表示するためのコンポーネント。
 * 入れ子構造（children）にも対応しており、再帰的にセクションを表示する。
 * セクションの階層に応じて見出しレベル（h2〜h6）を動的に設定。
 * 
 * @param {Array} sections - 表示すべきセクション配列（子セクションも含む）
 * @returns {JSX.Element} セクション表示部分
 */
const AboutSections = ({ sections }) => {
  /**
   * セクションを再帰的にレンダリングする関数
   * 
   * @param {Array} items - セクションの配列
   * @param {number} depth - 階層の深さ（見出しレベルに利用、デフォルトは1）
   * @returns {JSX.Element[]} 再帰的に生成されたセクション要素群
   */
  const renderSections = (items, depth = 1) => (
    <>
      {items.map((item) => {
        // 見出しタグ（h2〜h6）を階層に応じて動的に選ぶ
        const HeadingTag = `h${Math.min(depth + 1, 6)}`;

        return (
          <section
            className={`about-section depth-${depth}`} // スタイル用クラス（階層別）
            id={item.id} // アンカーリンク用 ID
            key={item.id}
          >
            {/* セクションのタイトル（h2〜h6） */}
            <HeadingTag className={`heading depth-${depth}`}>
              {item.title}
            </HeadingTag>

            {/* セクションの本文（JSX要素） */}
            <div className={`about-content depth-${depth}`}>
              {item.content}
            </div>

            {/* 子セクションがあれば再帰的に表示 */}
            {item.children && renderSections(item.children, depth + 1)}
          </section>
        );
      })}
    </>
  );

  return (
    <div className="about-section-container">
      {/* ルートセクションの描画開始 */}
      {renderSections(sections)}
    </div>
  );
};

export default AboutSections;
