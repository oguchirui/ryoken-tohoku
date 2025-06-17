import { useNavigate } from "react-router-dom";

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
