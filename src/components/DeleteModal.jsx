import { useMapDispatch } from "../context/MapContext";
import { useDeleteModal, useDeleteModalDispatch } from "../context/DeleteModalContext";
import { useState } from "react";
import Modal from "./Modal";
import { fetchPassword, deleteRecord, fetchClickedRecords } from "../supabaseFunctions";

const DeleteModal = () => {
  const [inputPassword, setInputPassword] = useState("");
  const [isCorrect, setIsCorrect] = useState(true);
  const [modalStep, setModalStep] = useState(0); // modalStep: 0 - パスワード入力, 1 - 完了メッセージ

  const mapDispatch = useMapDispatch();

  const { isModalOpen, recordToDelete } = useDeleteModal();
  const deleteModalDispatch = useDeleteModalDispatch();


  // 閉じるボタンorバツボタン押下時に状態リセット
  const closeModal = () => {
    deleteModalDispatch({ type: "close" });
    setTimeout(() => {
      setInputPassword("");
      setIsCorrect(true);
      setModalStep(0);
    }, 200);
  };

    // パスワードチェックと削除処理
  const handleCheckPassword = async () => {
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
        setModalStep(1);
      } else {
        setIsCorrect(false);
      }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="password-check-container">
        {modalStep === 0 && (
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
                type="submit"
              >
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
