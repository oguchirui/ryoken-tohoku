import { useNavigate } from "react-router-dom";

// Homeページに遷移するボタンコンポーネント

const ToHomePageButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="change-page-button"
      onClick={() => navigate("/")}
    >
      ホームに戻る
    </button>
  );
};

export default ToHomePageButton;
