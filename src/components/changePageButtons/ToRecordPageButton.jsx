import { useMapDispatch } from "@/contexts/MapContext";
import { useNavigate } from "react-router-dom";

const ToRecordPageButton = () => {
  const dispatch = useMapDispatch();
  const navigate = useNavigate();

  return (
      <button
        className="change-page-button to-record"
        onClick={() => {
          dispatch({
            type: 'click',
            payload: []
          });
          navigate("/record");
        }}>
        新しく活動を記録する
      </button>
  )
};

export default ToRecordPageButton;
