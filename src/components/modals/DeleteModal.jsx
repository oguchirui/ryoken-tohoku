import { useMapDispatch } from "@/contexts/MapContext";
import { useDeleteModal, useDeleteModalDispatch } from "@/contexts/DeleteModalContext";
import { useState } from "react";
import Modal from "./Modal";
import { fetchPassword, deleteRecord, fetchClickedRecords } from "@/api/supabaseFunctions";

/**
 * レコード削除用モーダルコンポーネント。
 * 2ステップ構成：
 *  1. パスワード入力
 *  2. 削除完了メッセージ表示
 *
 * @returns {JSX.Element} レコード削除モーダル
 */

const DeleteModal = () => {
  const [inputPassword, setInputPassword] = useState(""); // パスワードの入力値
  const [isCorrect, setIsCorrect] = useState(true); // パスワードが正しいかどうかの判定
  const [modalStep, setModalStep] = useState(0); // モーダルの現在のステップ（0: パスワード入力, 1: 完了メッセージ）

  const mapDispatch = useMapDispatch(); // マップの状態を更新するための dispatch 関数

  const { isModalOpen, recordToDelete } = useDeleteModal(); // モーダルの開閉状態と削除対象のレコード情報（コンテキストから取得）
  const deleteModalDispatch = useDeleteModalDispatch(); // モーダルの開閉制御用の dispatch 関数


  // モーダルを閉じ、状態を初期化する処理
  const closeModal = () => {
    deleteModalDispatch({ type: "close" });
    setTimeout(() => {
      setInputPassword("");
      setIsCorrect(true);
      setModalStep(0);
    }, 200); // モーダルのアニメーションが終わるまで少し待つ
  };

  // パスワードをチェックし、削除処理を行う
  const handleCheckPassword = async () => {
      const correctPassword = await fetchPassword(); // 正しいパスワードを取得
      // パスワードが一致した場合、削除を実行
      if (inputPassword === correctPassword) {
        // 削除後、同じ名前のレコードを再取得して地図を更新（反映）
        deleteRecord(recordToDelete.id).then(() => {
          fetchClickedRecords(recordToDelete.name).then((record) => {
            mapDispatch({
              type: "click",        // 地図上でのクリックイベントと同等の扱い
              payload: record,      // 更新されたレコードを渡す
            });
          });
          deleteModalDispatch({ type: "delete" }); // 状態から削除対象レコードを削除
        });
        setModalStep(1); // 完了ステップに移行
      } else {
        // パスワードが間違っている場合、エラー表示
        setIsCorrect(false);
      }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="password-check-container">
        {/* ステップ0: パスワード入力 */}
        {modalStep === 0 && (
          <div className="password-check">
            <h2>パスワードを入力してください。</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckPassword();
              }}
            >
              {/* ブラウザのオートフィル防止用 hidden username  */}
              <input
                type="text"
                autoComplete="username"
                value="ryoken-tohoku"
                hidden
                readOnly
              />

              {/* パスワード入力欄 */}
              <input
                type="password"
                autoComplete="current-password"
                placeholder="パスワード"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setIsCorrect(true); // 再入力時はエラーリセット
                }}
              />

              {/* パスワードが間違っている場合のエラーメッセージ */}
              {!isCorrect && (
                <p>
                  パスワードが間違っています。
                </p>
              )}
              
              <button
                className="submit-button"
                type="submit"
              >
                OK
              </button>
            </form>
          </div>
        )}

        {/* ステップ1: 削除完了メッセージ */}
        {modalStep === 1 && (
          <div className="password-check">
            <h2>削除が完了しました。</h2>
            <button onClick={closeModal}>
              ホームに戻る
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeleteModal;
