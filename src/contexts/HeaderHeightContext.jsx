import { createContext, useContext, useState } from "react";

/**
 * HeaderHeightContext.jsx
 * 
 * ヘッダーの高さを管理するためのコンテキスト。
 * ヘッダーの高さを取得・設定するためのカスタムフックを提供。
 * 
 * @returns {JSX.Element} コンテキストプロバイダー
 */

const HeaderHeightContext = createContext(); // ヘッダーの高さを保持する Context
const SetHeaderHeightContext = createContext(); // ヘッダーの高さを更新するための setState 関数を保持する Context

export const useHeaderHeight = () => useContext(HeaderHeightContext); // ヘッダーの高さを取得するカスタムフック
export const useSetHeaderHeight = () => useContext(SetHeaderHeightContext); // ヘッダーの高さを設定するカスタムフック

// プロバイダーコンポーネント：アプリ全体に高さ情報と setter を提供
export const HeaderHeightProvider = ({ children }) => {
  // ヘッダーの高さ（ピクセル単位）を管理する状態
  const [headerHeight, setHeaderHeight] = useState(0); // 初期値は0

  return (
    // ヘッダーの高さの値を子コンポーネントに提供
    <HeaderHeightContext.Provider value={headerHeight}>
      {/* ヘッダーの高さを更新するための setState 関数も提供 */}
      <SetHeaderHeightContext.Provider value={setHeaderHeight}>
        {children}
      </SetHeaderHeightContext.Provider>
    </HeaderHeightContext.Provider>
  );
};
