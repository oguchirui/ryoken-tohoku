import { useReducer, createContext, useContext } from "react";

const InputErrorsContext = createContext();
const InputErrorsDispatchContext = createContext();

export const useInputErrors = () => useContext(InputErrorsContext);
export const useInputErrorsDispatch = () => useContext(InputErrorsDispatchContext);

export const InputErrorsProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "setErrors":
        return action.payload;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, []);

  return (
    <InputErrorsContext.Provider value={state}>
      <InputErrorsDispatchContext.Provider value={dispatch}>
        {children}
      </InputErrorsDispatchContext.Provider>
    </InputErrorsContext.Provider>
  );
};
