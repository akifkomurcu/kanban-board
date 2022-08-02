import { createContext, useState } from "react";

const LastseenContext = createContext();

export const LastseenProvider = ({ children }) => {
  const [lastSeen, setLastseen] = useState([]);

  const values = { lastSeen, setLastseen };
  return (
    <LastseenContext.Provider value={values}>
      {children}
    </LastseenContext.Provider>
  );
};
export default LastseenContext;
