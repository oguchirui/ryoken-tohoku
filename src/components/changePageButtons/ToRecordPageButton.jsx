import { useMapDispatch } from "@/contexts/MapContext";
import { useNavigate } from "react-router-dom";

// 新しい活動を記録するページに遷移するボタンコンポーネント

const ToRecordPageButton = () => {
  const dispatch = useMapDispatch();
  const navigate = useNavigate();

  return (
      <button
        className="change-page-button to-record"
        onClick={() => {
          // クリックイベントをMapContextに通知
          dispatch({
            type: 'click',
            payload: [] // クリックされたレコードを空にする
          });
          navigate("/record");
        }}>
        新しく活動を記録する
      </button>
  )
};

export default ToRecordPageButton;
