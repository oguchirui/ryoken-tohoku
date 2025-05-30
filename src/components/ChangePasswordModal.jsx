import { useChangePassword, useChangePasswordDispatch } from "../context/ChangePasswordContext";
import { useState } from "react";
import Modal from "./Modal";
import { fetchPassword, updatePassword } from "../supabaseFunctions";

const ChangePasswordModal = () => {
  const [inputPassword, setInputPassword] = useState("");
  const [isCorrect, setIsCorrect] = useState(true);
  const [modalStep, setModalStep] = useState(0);  // modalStep: 0 - パスワード入力, 1 - 新しいパスワード入力, 2 - 完了メッセージ
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordEntered, setIsNewPasswordEntered] = useState(true);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isConfirmNewPasswordEntered, setIsConfirmNewPasswordEntered] = useState(true);
  const [isNewPasswordMatch, setIsNewPasswordMatch] = useState(true);

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
      setIsNewPasswordEntered(true);
      setConfirmNewPassword("");
      setIsConfirmNewPasswordEntered(true);
      setIsNewPasswordMatch(true);
    }, 200);
  };

  // パスワードチェック処理
  const handleCheckPassword = async () => {
    const correctPassword = await fetchPassword();
    if (inputPassword === correctPassword) {
      setModalStep(1);
    } else {
      setIsCorrect(false);
    }
  }

  // 新しいパスワード更新処理
  const handleUpdatePassword = async () => {
    if (newPassword == "") {
      setIsNewPasswordEntered(false);
    } else if (confirmNewPassword == "") {
      setIsConfirmNewPasswordEntered(false);
    } else if (newPassword !== confirmNewPassword) {
      setIsNewPasswordMatch(false);
    } else {
      await updatePassword(newPassword);
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
              {/* <input
                type="text"
                autoComplete="username"
                hidden
              /> */}

              <input
                type="password"
                autoComplete="current-password"
                placeholder="現在のパスワード"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value)
                  setIsCorrect(true);  // パスワード入力時にエラーメッセージをリセット
                }}
              />

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
                type="password"
                autoComplete="new-password"
                placeholder="新しいパスワード"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setIsNewPasswordEntered(true);
                  setIsConfirmNewPasswordEntered(true);
                  setIsNewPasswordMatch(true);  // パスワード入力時にエラーメッセージをリセット
                }}
              />

              <input
                className="confirm-password-input"
                type="password"
                autoComplete="new-password"
                placeholder="新しいパスワード（再入力）"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setIsNewPasswordEntered(true);
                  setIsConfirmNewPasswordEntered(true);
                  setIsNewPasswordMatch(true);  // パスワード入力時にエラーメッセージをリセット
                }}
              />

              {!isNewPasswordEntered && (
                <p>
                  新しいパスワードを入力してください。
                </p>
              )}
              {!isConfirmNewPasswordEntered && (
                <p>
                  新しいパスワードを再入力してください。
                </p>
              )}
              {!isNewPasswordMatch && (
                <p>
                  パスワードが一致しません。
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

        {modalStep === 2 && (
          <div className="password-check">
            <h2>パスワードの再設定が完了しました。</h2>
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
