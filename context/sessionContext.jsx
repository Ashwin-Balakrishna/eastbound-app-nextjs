import { useState, useContext, createContext } from "react";
import { getSessionToken } from "../utils/helper";

const SessionContext = createContext();
const SessionUpdateContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const useSessionUpdate = () => {
  return useContext(SessionUpdateContext);
};

const sessionToken = getSessionToken();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(sessionToken);

  const updateSession = () => {
    setSession(getSessionToken());
  };

  return (
    <SessionContext.Provider value={session}>
      <SessionUpdateContext.Provider value={updateSession}>
        {children}
      </SessionUpdateContext.Provider>
    </SessionContext.Provider>
  );
};
