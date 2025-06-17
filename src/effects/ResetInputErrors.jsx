import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useInputErrorsDispatch } from "@/contexts/InputErrorsContext";

const ResetInputErrors = () => {
  const { pathname } = useLocation();
  const inputErrorsDispatch = useInputErrorsDispatch();

  useEffect(() => {
    // パスが変わるたびにエラーをリセット
    inputErrorsDispatch({ type: "setErrors", payload: [] });
  }, [pathname, inputErrorsDispatch]);

  return null;
};

export default ResetInputErrors;
