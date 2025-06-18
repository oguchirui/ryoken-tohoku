import { useReducer, createContext, useContext } from "react";

/**
 * MapContext.jsx
 * 
 * 地図上の状態を管理するためのコンテキスト。
 * - クリックされたレコード情報（clickedRecords）
 * - フィルターパラメータ（filterParams）
 * 
 * コンポーネントから状態参照・更新ができるように、
 * 状態用と dispatch 用のコンテキストをそれぞれ定義。
 * 
 * @returns {JSX.Element} コンテキストプロバイダー
 */

const MapContext = createContext(); // 状態（clickedRecords / filterParams）を提供するコンテキスト
const MapDispatchContext = createContext(); // 状態更新用の dispatch 関数を提供するコンテキスト

export const useMap = () =>  useContext(MapContext); // 状態を取得するカスタムフック
export const useMapDispatch = () => useContext(MapDispatchContext); // 状態を更新する dispatch 関数を取得するカスタムフック

// プロバイダーコンポーネント：アプリ全体に地図状態と更新関数を提供
export const MapProvider = ({ children }) => {
  /**
   * reducer関数：アクションに応じて状態を更新する
   */
  const reducer = (state, action) => {
    switch (action.type) {
      case "click":
        // 地図上でクリックされた記録データを更新
        return {
          ...state,
          clickedRecords: action.payload,
        };

      case "filter":
        // フィルターパラメータの更新
        if ("key" in action.payload && "value" in action.payload) {
          // 単一のキー・バリューの更新
          return {
            ...state,
            filterParams: {
              ...state.filterParams,
              [action.payload.key]: action.payload.value,
            },
          };
        } else {
          // 複数のキーをまとめて一括更新
          return {
            ...state,
            filterParams: {
              ...state.filterParams,
              ...action.payload,
            },
          };
        }

      default:
        // 未知のアクションに対するエラー
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  /**
   * 状態の初期値
   * - clickedRecords: クリックされた活動記録の配列（初期は空）
   * - filterParams: フィルター条件（初期は「すべて」）
   */
  const [state, dispatch] = useReducer(reducer, {
    clickedRecords: [], // 地図上でクリックされた記録データ
    filterParams: {
      year: "すべて",           // 年のフィルター
      month: "すべて",          // 月のフィルター
      day: "すべて",            // 日のフィルター
      prefecture: "すべて",     // 都道府県
      type: "すべて",           // 訪れた回数の指定方法
      numArr: [0, Number.MAX_SAFE_INTEGER], // 訪れた回数、範囲
    },
  });

  return (
    // 状態を提供
    <MapContext.Provider value={state}>
      {/* 状態更新関数を提供 */}
      <MapDispatchContext.Provider value={dispatch}>
        {children}
      </MapDispatchContext.Provider>
    </MapContext.Provider>
  );
};