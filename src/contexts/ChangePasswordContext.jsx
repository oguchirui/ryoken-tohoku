import { useReducer, createContext, useContext } from "react";

/**
 * パスワード変更モーダルの状態管理コンテキスト。
 * モーダルの開閉状態を管理するためのコンテキストとディスパッチ関数を提供。
 * 
 * @returns {JSX.Element} コンテキストプロバイダー
 */

const ChangePasswordContext = createContext(); // 状態を格納するためのコンテキスト
const ChangePasswordDispatchContext = createContext(); // 状態を更新するための dispatch 関数用コンテキスト

export const useChangePassword = () => useContext(ChangePasswordContext); // 状態を取得するためのカスタムフック
export const useChangePasswordDispatch = () => useContext(ChangePasswordDispatchContext); // dispatch 関数を取得するためのカスタムフック

// プロバイダーコンポーネント
export const ChangePasswordProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "open": // モーダルを開く
        return {
          ...state,
          isModalOpen: true,
        };
      case "close": // モーダルを閉じる
        return {
          ...state,
          isModalOpen: false,
        };
      default:
        // 想定外のアクションが来た場合はエラーを投げる
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  // useReducer で状態と dispatch 関数を初期化
  const [state, dispatch] = useReducer(reducer, {
    isModalOpen: false, // 初期状態ではモーダルは閉じている
  });

  return (
    // 状態（isModalOpen）を子コンポーネントに提供
    <ChangePasswordContext.Provider value={state}>
      {/* dispatch 関数を子コンポーネントに提供 */}
      <ChangePasswordDispatchContext.Provider value={dispatch}>
        {children}
      </ChangePasswordDispatchContext.Provider>
    </ChangePasswordContext.Provider>
  );
};
