import { useReducer, createContext, useContext } from "react";

/**
 * InputErrorsContext.jsx
 * コンポーネントの入力エラーを管理するためのコンテキスト。
 * このコンテキストは、フォームの入力エラーを格納し、更新するためのディスパッチ関数を提供します。
 * 
 * @returns {JSX.Element} コンテキストプロバイダー
 */

const InputErrorsContext = createContext(); // 入力エラー配列を保持するコンテキスト
const InputErrorsDispatchContext = createContext(); // 入力エラーの更新関数を提供するコンテキスト

export const useInputErrors = () => useContext(InputErrorsContext); // 入力エラー配列（state）を取得するカスタムフック
export const useInputErrorsDispatch = () => useContext(InputErrorsDispatchContext); // エラー更新用の dispatch 関数を取得するカスタムフック

// プロバイダー：アプリ全体に入力エラー状態と更新関数を提供
export const InputErrorsProvider = ({ children }) => {

  /**
   * reducer関数
   * 現在のエラー状態を、dispatch されたアクションに応じて更新する
   */
  const reducer = (state, action) => {
    switch (action.type) {
      case "setErrors":
        // エラー一覧を新しくセットする
        return action.payload;
      default:
        // 不正なアクションに対しては例外を投げる
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  // useReducer による状態と dispatch 関数の初期化
  const [state, dispatch] = useReducer(reducer, []); // 初期状態はエラーなし（空配列）

  return (
    // エラー状態をアプリ内に提供
    <InputErrorsContext.Provider value={state}>
      {/* エラー更新用の dispatch 関数も提供 */}
      <InputErrorsDispatchContext.Provider value={dispatch}>
        {children}
      </InputErrorsDispatchContext.Provider>
    </InputErrorsContext.Provider>
  );
};
