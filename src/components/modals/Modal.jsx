import { useState, useEffect } from "react";

/**
 * 汎用モーダルコンポーネント。
 * アニメーション付きで開閉可能。
 * 
 * @param {Boolean} isOpen - モーダルの開閉状態
 * @param {Function} onClose - モーダルを閉じるためのコールバック関数
 * @param {JSX.Element} children - モーダル内に表示するコンテンツ
 * 
 * @returns {JSX.Element|null} モーダルコンポーネント
 */

const Modal = ({ isOpen, onClose, children }) => {
  const [show, setShow] = useState(false); // モーダルの表示状態
  const [animation, setAnimation] = useState(""); // アニメーションの状態

  // モーダルの開閉状態に応じてアニメーションを制御
  useEffect(() => {
    if (isOpen) {
      // 開く場合：モーダルを表示し、フェードイン開始
      setShow(true);
      setAnimation("fade-in");
    } else {
      // 閉じる場合：フェードアウト開始し、終了後に非表示
      setAnimation("fade-out");
      const timer = setTimeout(() => setShow(false), 200); // アニメーションの時間に合わせて非表示にする
      return () => clearTimeout(timer); // クリーンアップ：前回の setTimeout をキャンセル
    }
  }, [isOpen]);

  // 非表示状態の場合は DOM に何もレンダリングしない
  if (!show) return null;

  return (
    // モーダルの背景（オーバーレイ）。クリックすると onClose が呼ばれる
    <div
      className={`modal-overlay ${animation}`}
      onClick={onClose}
    >
       {/* モーダルの中身部分。背景クリックのイベントは中身では発生しない */}
      <div
        className={`modal-content ${animation}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          className="close-button"
          onClick={onClose}
        >×</button>
        {/* モーダル内部に表示するコンテンツ */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
