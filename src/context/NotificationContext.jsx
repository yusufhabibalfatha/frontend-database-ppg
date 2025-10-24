import { createContext } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const showNotification = (message) => {
    alert(message);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
