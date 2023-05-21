import { createContext, useState } from 'react';

// Create the context
const MessagesContext = createContext();

// Create a provider component
export const MessagesContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // Define any functions or state variables that you want to share

  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesContext;