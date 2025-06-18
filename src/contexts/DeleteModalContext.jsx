import { useReducer, createContext, useContext } from "react";

/**
 * DeleteModalContext.jsx
 * 
 * 削除モーダルの状態管理用コンテキスト。
 * - モーダルの開閉状態（isModalOpen）
 * - 削除対象のレコード情報（recordToDelete）
 * - 削除後に変化を通知するフラグ（hasDeleted）
 * 
 * コンポーネントから状態参照・更新ができるように、
 * 状態用と dispatch 用のコンテキストをそれぞれ定義。
 * 
 * * @returns {JSX.Element} コンテキストプロバイダー
 */

const DeleteModalContext = createContext(); // 状態を保持するコンテキスト（isModalOpen, recordToDelete, hasDeleted）
const DeleteModalDispatchContext = createContext(); // 状態更新用の dispatch 関数を提供するコンテキスト

export const useDeleteModal = () => useContext(DeleteModalContext); // 状態（state）を取得するためのカスタムフック
export const useDeleteModalDispatch = () => useContext(DeleteModalDispatchContext); // dispatch 関数を取得するためのカスタムフック

// プロバイダーコンポーネント：アプリ全体に状態と dispatch を提供
export const DeleteModalProvider = ({ children }) => {

  /**
   * reducer関数：dispatchされたアクションに基づいて状態を更新
   */
  const reducer = (state, action) => {
    switch (action.type) {
      case "open":
        return {
          ...state,
          isModalOpen: true,          // モーダルを開く
          recordToDelete: action.payload, // 削除対象のレコードを保存
        };
      case "close":
        return {
          ...state,
          isModalOpen: false,         // モーダルを閉じる
          recordToDelete: null,       // 対象レコードをリセット
        };
      case "delete":
        return {
          ...state,
          hasDeleted: !state.hasDeleted, // 削除が実行されたことを通知（トグルで変化させる）
        };
      default:
        // 未知のアクションに対してはエラーを出す
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  // useReducer で状態と dispatch 関数を初期化
  const [state, dispatch] = useReducer(reducer, {
    isModalOpen: false,      // 初期状態：モーダルは閉じている
    recordToDelete: null,    // 初期状態：削除対象は存在しない
    hasDeleted: false,       // 削除アクションが実行されたかどうかのフラグ（UI更新用）
  });

  return (
    // 状態をアプリに提供
    <DeleteModalContext.Provider value={state}>
      {/* dispatch 関数も提供（状態変更のため） */}
      <DeleteModalDispatchContext.Provider value={dispatch}>
        {children}
      </DeleteModalDispatchContext.Provider>
    </DeleteModalContext.Provider>
  );
};
