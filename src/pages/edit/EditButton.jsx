import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInputErrorsDispatch } from "@/contexts/InputErrorsContext";
import Modal from "@/components/modals/Modal";
import { fetchPassword, updateRecord } from "@/api/supabaseFunctions";

/**
 * 編集ボタンコンポーネント
 * 活動記録を更新する際に使う。
 * 押下時にバリデーション → モーダル表示 → パスワード入力 → 正しければ更新処理を実行。
 *
 * @param {Object} props - 活動記録の情報と入力チェックのフラグ群
 * @returns {JSX.Element}
 */
const EditButton = (props) => {
  // モーダル関連の状態管理
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダル開閉状態
  const [inputPassword, setInputPassword] = useState(""); // 入力されたパスワード
  const [isCorrect, setIsCorrect] = useState(true); // パスワードの正誤
  const [modalStep, setModalStep] = useState(0); // モーダルの段階（0: 入力, 1: 完了）

  const navigate = useNavigate(); // ページ遷移用
  const inputErrorsDispatch = useInputErrorsDispatch(); // 入力エラー制御用
  const location = useLocation(); // 遷移元ページからのデータ取得
  const oldRecord = location.state; // 編集前のレコード
  const oldId = oldRecord.id;

  // props から新しいレコードデータを生成
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

  /**
   * モーダルを閉じて状態をリセット（×ボタン用）
   */
  const closeModalOnly = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setInputPassword("");
      setIsCorrect(true);
      setModalStep(0);
    }, 200); // アニメーションのための遅延
  };

  /**
   * モーダルを閉じてホームへ遷移（完了ボタン用）
   */
  const closeModalAndNavigate = () => {
    closeModalOnly();
    navigate("/");
  };

  /**
   * 編集ボタン押下時の処理
   * 入力項目のバリデーションを行い、OKならモーダルを表示
   */
  const openModal = () => {
    const errors = [];
    if (!props.isDateEntered) errors.push("活動日が未選択です。");
    if (!props.isPlaceNameEntered) errors.push("活動場所名が未入力です。");
    if (!props.isLatLngEntered) errors.push("活動場所が未選択です。");
    if (!props.isDescriptionEntered) errors.push("活動内容が未入力です。");

    if (errors.length > 0) {
      inputErrorsDispatch({ type: "setErrors", payload: errors });
      return;
    }

    inputErrorsDispatch({ type: "setErrors", payload: [] }); // エラーがなければリセット
    setIsModalOpen(true);
  };

  /**
   * パスワードを検証し、正しければ活動記録を更新
   */
  const handleCheckPassword = async () => {
    const correctPassword = await fetchPassword();
    if (inputPassword === correctPassword) {
      await updateRecord(record, oldId); // レコード更新
      setModalStep(1); // 完了画面へ
    } else {
      setIsCorrect(false); // パスワード不一致
    }
  };

  return (
    <div>
      {/* 更新ボタン */}
      <button
        className="change-page-button"
        onClick={openModal}
      >
        更新する
      </button>

      {/* モーダル部分 */}
      <Modal isOpen={isModalOpen} onClose={closeModalOnly}>
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
                {/* オートフィル対策の hidden フィールド */}
                <input
                  type="text"
                  autoComplete="username"
                  value="ryoken-tohoku"
                  hidden
                  readOnly
                />

                {/* パスワード入力 */}
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="パスワード"
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setIsCorrect(true); // 入力時にエラーをリセット
                  }}
                />

                {/* パスワードが間違っている場合のエラー表示 */}
                {!isCorrect && (
                  <p>パスワードが間違っています。</p>
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

          {/* ステップ1: 更新完了画面 */}
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
