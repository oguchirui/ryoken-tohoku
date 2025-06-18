import { useNavigate } from "react-router-dom";

// Aboutページに遷移するボタンコンポーネント

const ToAboutPageButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate("/about");
      }}>
      このサイトについて
    </button>
  );
};

export default ToAboutPageButton;
