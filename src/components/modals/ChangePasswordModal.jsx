import { useChangePassword, useChangePasswordDispatch } from "@/contexts/ChangePasswordContext";
import { useState } from "react";
import Modal from "./Modal";
import { fetchPassword, updatePassword } from "@/api/supabaseFunctions";

/**
 * パスワード変更用モーダルコンポーネント。
 * 3ステップ構成：
 *  1. 現在のパスワード確認
 *  2. 新しいパスワード入力
 *  3. 完了メッセージ表示
 * 
 * @returns {JSX.Element} パスワード変更モーダル
 */

const ChangePasswordModal = () => {
  const [inputPassword, setInputPassword] = useState(""); // 現在のパスワードの入力値
  const [isCorrect, setIsCorrect] = useState(true); // 現在のパスワードが正しいかどうかの判定
  const [modalStep, setModalStep] = useState(0); // モーダルの現在のステップ（0: パスワード入力, 1: 新パスワード入力, 2: 完了）
  const [newPassword, setNewPassword] = useState(""); // 新しいパスワードの入力値
  const [isNewPasswordEntered, setIsNewPasswordEntered] = useState(true); // 新しいパスワードが入力されているか（未入力時エラー表示）
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // 新しいパスワード（確認用）の入力値
  const [isConfirmNewPasswordEntered, setIsConfirmNewPasswordEntered] = useState(true); // 確認用パスワードが入力されているか
  const [isNewPasswordMatch, setIsNewPasswordMatch] = useState(true); // 新しいパスワードと確認パスワードが一致しているか

  const { isModalOpen } = useChangePassword(); // モーダルの開閉状態（コンテキストから取得）
  const changePasswordDispatch = useChangePasswordDispatch(); // モーダルの開閉制御用の dispatch 関数

  // モーダルを閉じ、状態を初期化する処理
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
    }, 200); // モーダルのアニメーションが終わるまで少し待つ
  };

  // 現在のパスワードが正しいか確認する処理
  const handleCheckPassword = async () => {
    const correctPassword = await fetchPassword();
    if (inputPassword === correctPassword) {
      // 正しければ新しいパスワード入力ステップへ
      setModalStep(1);
    } else {
      // 間違っていればエラー表示
      setIsCorrect(false);
    }
  }

  // 新しいパスワードをチェックし、更新する処理
  const handleUpdatePassword = async () => {
    if (newPassword === "") {
      // 新しいパスワードが未入力
      setIsNewPasswordEntered(false);
    } else if (confirmNewPassword === "") {
      // 確認用パスワードが未入力
      setIsConfirmNewPasswordEntered(false);
    } else if (newPassword !== confirmNewPassword) {
      // 両者が一致しない
      setIsNewPasswordMatch(false);
    } else {
      // 問題なければパスワードを更新して完了ステップへ
      await updatePassword(newPassword);
      setModalStep(2);
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div className="password-check-container">
        {/* ステップ0: 現在のパスワードを確認する画面 */}
        {modalStep === 0 && (
          <div className="password-check">
            <h2>現在のパスワードを入力してください。</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckPassword();
              }}
            >
              {/* ブラウザのオートフィル防止用 hidden username */}
              <input
                type="text"
                autoComplete="username"
                value="ryoken-tohoku"
                hidden
                readOnly
              />

              {/* 現在のパスワード入力欄 */}
              <input
                type="password"
                autoComplete="current-password"
                placeholder="現在のパスワード"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setIsCorrect(true); // 再入力時はエラーリセット
                }}
              />

              {/* 間違ったパスワードが入力されたときに表示 */}
              {!isCorrect && (
                <p>パスワードが間違っています。</p>
              )}

              <button className="submit-button" type="submit">
                OK
              </button>
            </form>
          </div>
        )}

        {/* ステップ1: 新しいパスワードの入力画面 */}
        {modalStep === 1 && (
          <div className="password-check">
            <h2>新しいパスワードを入力してください。</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePassword();
              }}
            >
              {/* ブラウザのオートフィル防止 hidden username */}
              <input
                type="text"
                autoComplete="username"
                value="ryoken-tohoku"
                hidden
                readOnly
              />

              {/* 新しいパスワード入力欄 */}
              <input
                type="password"
                autoComplete="new-password"
                placeholder="新しいパスワード"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setIsNewPasswordEntered(true);
                  setIsConfirmNewPasswordEntered(true);
                  setIsNewPasswordMatch(true); // 入力時にエラーリセット
                }}
              />

              {/* 確認用パスワード入力欄 */}
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
                  setIsNewPasswordMatch(true); // 入力時にエラーリセット
                }}
              />

              {/* 入力チェックのエラーメッセージ表示 */}
              {!isNewPasswordEntered && (
                <p>新しいパスワードを入力してください。</p>
              )}
              {!isConfirmNewPasswordEntered && (
                <p>新しいパスワードを再入力してください。</p>
              )}
              {!isNewPasswordMatch && (
                <p>パスワードが一致しません。</p>
              )}

              <button className="submit-button" type="submit">
                OK
              </button>
            </form>
          </div>
        )}

        {/* ステップ2: 完了メッセージの表示 */}
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