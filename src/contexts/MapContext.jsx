import { useReducer, createContext, useContext } from "react";

const MapContext = createContext();
const MapDispatchContext = createContext();

export const useMap = () =>  useContext(MapContext);
export const useMapDispatch = () => useContext(MapDispatchContext);

export const MapProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "click":
        return {
          ...state,
          clickedRecords: action.payload,
        };
      case "filter":
        if ("key" in action.payload && "value" in action.payload) {
          return {
            ...state,
            filterParams: {
              ...state.filterParams,
              [action.payload.key]: action.payload.value,
            },
          };
        } else {
          // 複数キーまとめて更新
          return {
            ...state,
            filterParams: {
              ...state.filterParams,
              ...action.payload,
            },
          };
        }
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };


  const [state, dispatch] = useReducer(reducer, {
    clickedRecords: [],
    filterParams: {
      year: "すべて",
      month: "すべて",
      day: "すべて",
      prefecture: "すべて",
      type: "すべて",
      numArr: [0, Number.MAX_SAFE_INTEGER]
    }
  });

  return (
    <MapContext.Provider value={state}>
      <MapDispatchContext.Provider value={dispatch}>
        {children}
      </MapDispatchContext.Provider>
    </MapContext.Provider>
  );
};
