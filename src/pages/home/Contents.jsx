import { useMap } from "@/contexts/MapContext";
import KebabMenu from "./KebabMenu";

/**
 * Contentsコンポーネント
 * 
 * 地図上で選択された場所（ピン）の活動記録を表示するパネル。
 * - クリックされた記録がない場合は「記録がありません」のメッセージを表示
 * - 記録がある場合は、日時・内容・メニューボタンをリスト表示
 * 
 * @param {Function} handleHideContents - コンテンツパネルを非表示にするための関数
 * @returns {JSX.Element} コンテンツパネルの表示
 */
const Contents = ({ handleHideContents }) => {
  // MapContextから、クリックされた場所の記録を取得
  const { clickedRecords } = useMap();

  return (
    <>
      {/* クリックされた記録がない場合の表示 */}
      {clickedRecords.length === 0 && (
        <div className="contents-no-data">
          <div className="contents-header">
            {/* 仮で "a" と表示（白文字なので何も表示されていないように見える） */}
            <h2>a</h2>
            {/* 閉じるボタン。クリックでパネルを閉じる */}
            <button
              className="contents-close-button"
              onClick={handleHideContents}
            ></button>
          </div>
          <div className="contents-item">
            <h2>記録がありません</h2>
            <p>地図上のピンを選択すると、ここに記録が表示されます。</p>
          </div>
        </div>
      )}

      {/* クリックされた記録が1件以上ある場合の表示 */}
      {clickedRecords.length > 0 && (
        <>
          <div className="contents-header">
            {/* 選択中の場所名を表示（最初のレコードのnameを使用） */}
            <h2>{clickedRecords[0] ? clickedRecords[0].name : ''}</h2>
            {/* 閉じるボタン */}
            <button
              className="contents-close-button"
              onClick={handleHideContents}
            ></button>
          </div>

          <div className="contents-main">
            {/* クリックされた複数の記録をループして表示 */}
            {clickedRecords.map(record => {
              return (
                <div key={record.id} className="contents-item">
                  {/* 活動日 */}
                  <h3>{record.year}年{record.month}月{record.day}日</h3>
                  {/* 活動内容 */}
                  <p>{record.description}</p>
                  {/* 各記録ごとのメニューボタン（編集・削除） */}
                  <KebabMenu record={record} />
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Contents;
