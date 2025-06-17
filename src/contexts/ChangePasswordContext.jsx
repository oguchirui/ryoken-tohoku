import { useReducer, createContext, useContext } from "react";

const ChangePasswordContext = createContext();
const ChangePasswordDispatchContext = createContext();

export const useChangePassword = () => useContext(ChangePasswordContext);
export const useChangePasswordDispatch = () => useContext(ChangePasswordDispatchContext);

export const ChangePasswordProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "open":
        return {
          ...state,
          isModalOpen: true,
        };
      case "close":
        return {
          ...state,
          isModalOpen: false,
        };
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isModalOpen: false,
  });

  return (
    <ChangePasswordContext.Provider value={state}>
      <ChangePasswordDispatchContext.Provider value={dispatch}>
        {children}
      </ChangePasswordDispatchContext.Provider>
    </ChangePasswordContext.Provider>
  );
};