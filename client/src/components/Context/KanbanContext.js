import { createContext, useState, useContext } from "react";

const KanbanContext = createContext();

const KanbanProvider = ({ children }) => {
  const [Kanbans, setKanbans] = useState([]);

  const values = { Kanbans, setKanbans };
  return (
    <KanbanContext.Provider value={values}>{children}</KanbanContext.Provider>
  );
};
const useKanban = () => useContext(KanbanContext);

export { KanbanProvider, useKanban };
