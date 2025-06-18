import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useInputErrorsDispatch } from "@/contexts/InputErrorsContext";

/**
 * ResetInputErrors.jsx
 * ページ遷移時に入力エラーをリセットするためのコンポーネント。
 * useLocation フックを使用して、現在のパスが変わるたびにエラーをリセットします。
 * 
 * @returns {JSX.Element|null} null（何も表示しない）
 */

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
