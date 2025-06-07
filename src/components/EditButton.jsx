import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInputErrorsDispatch } from "../context/InputErrorsContext";
import Modal from "./Modal";
import { fetchPassword, updateRecord } from "../supabaseFunctions";

const EditButton = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [isCorrect, setIsCorrect] = useState(true);
  const [modalStep, setModalStep] = useState(0); // modalStep: 0 - パスワード入力, 1 - 完了メッセージ

  const navigate = useNavigate();

  const inputErrorsDispatch = useInputErrorsDispatch();

  const location = useLocation();
  const oldRecord = location.state;
  const oldId = oldRecord.id;

  const date = new Date(props.date);
  const record = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    name: props.name,
    lat: props.lat,
    lng: props.lng,
    prefecture: props.prefecture,
    description: props.description,
  };

  // モーダル閉じて状態リセット（バツボタン用）
  const closeModalOnly = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setInputPassword("");
      setIsCorrect(true);
      setModalStep(0);
    }, 200);
  };

  // 閉じるボタン押下時に状態リセット＆/homeへ遷移
  const closeModalAndNavigate = () => {
    closeModalOnly();
    navigate("/");
  };

  const openModal = () => {
    // 未入力の項目をチェック
    const errors = [];
    if (!props.isDateEntered) errors.push("活動日が未選択です。");
    if (!props.isPlaceNameEntered) errors.push("活動場所名が未入力です。");
    if (!props.isLatLngEntered) errors.push("活動場所が未選択です。");
    if (!props.isDescriptionEntered) errors.push("活動内容が未入力です。");

    if (errors.length > 0) {
      inputErrorsDispatch({ type: "setErrors", payload: errors });
      return;
    }

    inputErrorsDispatch({ type: "setErrors", payload: [] }) // エラーなしの場合はリセット
    setIsModalOpen(true);
  };

    // パスワードチェックと記録処理
  const handleCheckPassword = async () => {
    const correctPassword = await fetchPassword();
    if (inputPassword === correctPassword) {
      await updateRecord(record, oldId);
      setModalStep(1);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div>
      <button
        className="change-page-button"
        onClick={openModal}
      >
        更新する
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModalOnly}>
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
                  value="ryoken-tohoku"
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
              <h2>更新が完了しました。</h2>
              <button onClick={closeModalAndNavigate}>
                ホームに戻る
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default EditButton;
