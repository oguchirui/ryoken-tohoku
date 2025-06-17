import { useReducer, createContext, useContext } from "react";

const DeleteModalContext = createContext();
const DeleteModalDispatchContext = createContext();

export const useDeleteModal = () =>  useContext(DeleteModalContext);
export const useDeleteModalDispatch = () => useContext(DeleteModalDispatchContext);

export const DeleteModalProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "open":
        return {
          ...state,
          isModalOpen: true,
          recordToDelete: action.payload,
        };
      case "close":
        return {
          ...state,
          isModalOpen: false,
          recordToDelete: null,
        };
      case "delete":
        return {
          ...state,
          hasDeleted: !state.hasDeleted,
        };
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    isModalOpen: false,
    recordToDelete: null,
    hasDeleted: false,
  });

  return (
    <DeleteModalContext.Provider value={state}>
      <DeleteModalDispatchContext.Provider value={dispatch}>
        {children}
      </DeleteModalDispatchContext.Provider>
    </DeleteModalContext.Provider>
  );
};
