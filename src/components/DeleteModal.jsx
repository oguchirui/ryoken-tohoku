import { useMapDispatch } from "../context/MapContext";
import { useDeleteModal, useDeleteModalDispatch } from "../context/DeleteModalContext";
import { useState } from "react";
import Modal from "./Modal";
import { fetchPassword, deleteRecord, fetchClickedRecords } from "../supabaseFunctions";

const DeleteModal = () => {
  const [inputPassword, setInputPassword] = useState("");
  const [isCorrect, setIsCorrect] = useState(true);
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const mapDispatch = useMapDispatch();

  const { isModalOpen, recordToDelete } = useDeleteModal();
  const deleteModalDispatch = useDeleteModalDispatch();


  // 閉じるボタンorバツボタン押下時に状態リセット＆/homeへ遷移
  const closeModalAndNavigate = () => {
    deleteModalDispatch({ type: "close" });
    setTimeout(() => {
      setInputPassword("");
      setIsCorrect(true);
      setIsPasswordChecked(false);
    }, 200);
  };

    // パスワードチェックと記録処理
  const handleCheckPassword = async () => {
    if (!isPasswordChecked) {
      const correctPassword = await fetchPassword();
      if (inputPassword === correctPassword) {
        deleteRecord(recordToDelete.id).then(() => {
          fetchClickedRecords(recordToDelete.name).then((record) => {
            mapDispatch({
              type: "click",
              payload: record,
            });
          });
          deleteModalDispatch({ type: "delete" });
        });
        setIsCorrect(true);
        setIsPasswordChecked(true);
      } else {
        setIsCorrect(false);
      }
    } else {
      // 閉じるボタンを押した時
      closeModalAndNavigate();
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModalAndNavigate}>
      <div className="password-check-container">
        {!isPasswordChecked && (
          <div className="password-check">
            <h2>パスワードを入力してください。</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckPassword();
              }}
            >
              <input
                type="text"
                autoComplete="username"
                hidden
              />
              <input
                type="password"
                autoComplete="current-password"
                placeholder="パスワード"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setIsCorrect(true); // パスワード入力時にエラーメッセージをリセット
                }}
              />
              <button
                className="submit-button"
                type="submit">
                OK
              </button>
            </form>
            {!isCorrect && (
              <p>
                パスワードが間違っています。
              </p>
            )}
          </div>
        )}

        {isPasswordChecked && (
          <div className="password-check">
            <h2>削除が完了しました。</h2>
            <button onClick={handleCheckPassword}>
              ホームに戻る
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeleteModal;
