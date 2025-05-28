import { useChangePassword, useChangePasswordDispatch } from "../context/ChangePasswordContext";
import { useState } from "react";
import Modal from "./Modal";
import { fetchPassword, updatePassword } from "../supabaseFunctions";

const ChangePasswordModal = () => {
  const [inputPassword, setInputPassword] = useState("");
  const [isCorrect, setIsCorrect] = useState(true);
  const [modalStep, setModalStep] = useState(0);
  // modalStep: 0 - パスワード入力, 1 - 新しいパスワード入力, 2 - 完了メッセージ
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);

  const { isModalOpen } = useChangePassword();
  const changePasswordDispatch = useChangePasswordDispatch();

  // 閉じるボタンorバツボタン押下時に状態リセット
  const closeModal = () => {
    changePasswordDispatch({ type: "close" });
    setTimeout(() => {
      setInputPassword("");
      setIsCorrect(true);
      setModalStep(0);
      setNewPassword("");
      setIsNewPasswordValid(true);
    }, 200);
  };

  // パスワードチェック処理
  const handleCheckPassword = async () => {
    const correctPassword = await fetchPassword();
    if (inputPassword === correctPassword) {
      setIsCorrect(true);
      setModalStep(1);
    } else {
      setIsCorrect(false);
    }
  }

  // 新しいパスワード更新処理
  const handleUpdatePassword = async () => {
    if (newPassword == "") {
      setIsNewPasswordValid(false);
    } else {
      await updatePassword(newPassword);
      setIsNewPasswordValid(true);
      setModalStep(2);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="password-check-container">
        {modalStep === 0 && (
          <div className="password-check">
            <h2>現在のパスワードを入力してください。</h2>
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
                placeholder="現在のパスワード"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value)
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
            <h2>新しいパスワードを入力してください。</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePassword();
              }}
            >
              <input
                type="text"
                autoComplete="username"
                hidden
              />

              <input
                type="password"
                autoComplete="new-password"
                placeholder="新しいパスワード"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setIsNewPasswordValid(true); // パスワード入力時にエラーメッセージをリセット
                }}
              />
              <button
                className="submit-button"
                type="submit"
              >
                OK
              </button>
            </form>
            {!isNewPasswordValid && (
              <p>
                パスワードを入力してください。
              </p>
            )}
          </div>
        )}

        {modalStep === 2 && (
          <div className="password-check">
            <h2>パスワード再設定が完了しました。</h2>
            <button onClick={closeModal}>
              ホームに戻る
            </button>
          </div>
        )}
      </div>
    </Modal>
  );

};

export default ChangePasswordModal;
