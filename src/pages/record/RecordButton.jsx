import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInputErrorsDispatch } from "@/contexts/InputErrorsContext";
import Modal from "@/components/modals/Modal";
import { fetchPassword, insertRecord } from "@/api/supabaseFunctions";

/**
 * RecordButtonコンポーネント
 * 
 * ユーザーが「記録する」ボタンを押すと、
 * 入力内容の簡易バリデーション後にパスワード入力のモーダルを表示し、
 * 正しいパスワード入力で記録データをデータベースに登録する。
 * 
 * @param {object} props - 各入力項目の値や入力済みフラグ
 * @returns JSX.Element
 */
const RecordButton = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態
  const [inputPassword, setInputPassword] = useState(""); // パスワード入力欄の状態
  const [isCorrect, setIsCorrect] = useState(true); // パスワード正誤判定
  const [modalStep, setModalStep] = useState(0); // モーダルのステップ管理（0: パスワード入力、1: 完了メッセージ）

  const navigate = useNavigate();

  // 入力エラー用のコンテキストディスパッチ（エラーメッセージ管理）
  const inputErrorsDispatch = useInputErrorsDispatch();

  // 日付情報からrecordオブジェクトを作成
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

  // モーダルを閉じて内部状態をリセット
  const closeModalOnly = () => {
    setIsModalOpen(false);
    // モーダル閉じた後に状態をクリア（アニメーションや遅延対応のためsetTimeout）
    setTimeout(() => {
      setInputPassword("");
      setIsCorrect(true);
      setModalStep(0);
    }, 200);
  };

  // モーダル閉じてホーム画面に戻る
  const closeModalAndNavigate = () => {
    closeModalOnly();
    navigate("/");
  };

  // 「記録する」ボタン押下時の処理
  const openModal = () => {
    // 入力チェック：未入力の項目があればエラーメッセージをセットして処理終了
    const errors = [];
    if (!props.isDateEntered) errors.push("活動日が未選択です。");
    if (!props.isPlaceNameEntered) errors.push("活動場所名が未入力です。");
    if (!props.isLatLngEntered) errors.push("活動場所が未選択です。");
    if (!props.isDescriptionEntered) errors.push("活動内容が未入力です。");

    if (errors.length > 0) {
      inputErrorsDispatch({ type: "setErrors", payload: errors });
      return;
    }

    // エラーなしならエラーメッセージをクリアしモーダルを開く
    inputErrorsDispatch({ type: "setErrors", payload: [] });
    setIsModalOpen(true);
  };

  // パスワードをチェックし、正しければ記録を挿入し完了画面へ
  const handleCheckPassword = async () => {
    const correctPassword = await fetchPassword();  // 正しいパスワードを取得
    if (inputPassword === correctPassword) {
      await insertRecord(record);  // 記録をDBに挿入
      setModalStep(1);             // 完了画面へ切り替え
    } else {
      setIsCorrect(false);         // 間違い表示
    }
  };

  return (
    <div>
      {/* 記録開始ボタン */}
      <button
        className="change-page-button"
        onClick={openModal}
      >
        記録する
      </button>

      {/* モーダル */}
      <Modal isOpen={isModalOpen} onClose={closeModalOnly}>
        <div className="password-check-container">
          {/* ステップ0: パスワード入力画面 */}
          {modalStep === 0 && (
            <div className="password-check">
              <h2>パスワードを入力してください。</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckPassword();
                }}
              >
                {/* 自動入力用ダミーinput（ブラウザの補完用） */}
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
                    setIsCorrect(true); // 入力時はエラー非表示に戻す
                  }}
                />

                {/* パスワードエラー表示 */}
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

          {/* ステップ1: 記録完了画面 */}
          {modalStep === 1 && (
            <div className="password-check">
              <h2>記録が完了しました。</h2>
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

export default RecordButton;
