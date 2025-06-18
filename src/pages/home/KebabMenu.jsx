import { useMapDispatch } from "@/contexts/MapContext";
import { useDeleteModalDispatch } from "@/contexts/DeleteModalContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

/**
 * KebabMenuコンポーネント
 * 
 * 活動記録（record）ごとの「︙」（ケバブメニュー）を表示。
 * メニューは編集と削除の2つの操作を提供する。
 * 
 * @param {Object} record - 対象の活動記録データ
 * @returns {JSX.Element} ケバブメニューUI
 */
const KebabMenu = ({ record }) => {
  const mapDispatch = useMapDispatch(); // 地図状態の更新用dispatch
  const deleteModalDispatch = useDeleteModalDispatch(); // 削除モーダル開閉用dispatch
  const navigate = useNavigate(); // ページ遷移用フック
  const [menuOpen, setMenuOpen] = useState(false); // メニュー開閉状態管理
  const menuRef = useRef(null); // メニューDOMへの参照

  // 編集ボタン押下時の処理
  const handleEdit = () => {
    // 地図のクリック選択状態をクリア
    mapDispatch({
      type: 'click',
      payload: []
    });
    // 編集ページへ遷移し、選択したrecordをstateとして渡す
    navigate("/edit", { state: record });
  };

  // 削除ボタン押下時の処理
  const handleDelete = () => {
    // 削除モーダルを開き、対象レコード情報を渡す
    deleteModalDispatch({
      type: 'open',
      payload: record
    });
    // メニューを閉じる
    setMenuOpen(false);
  };

  // メニュー外クリックでメニューを閉じる処理（PC・スマホ対応）
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef}>
      {/* メニューオプション（編集・削除） */}
      <div className={`menu-options ${menuOpen ? 'open' : ''}`}>
        <button onClick={handleEdit}>編集</button>
        <span className="divider"></span>
        <button onClick={handleDelete}>削除</button>
      </div>

      {/* メニュー開閉トグルボタン（ケバブアイコン） */}
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </button>
    </div>
  );
};

export default KebabMenu;
