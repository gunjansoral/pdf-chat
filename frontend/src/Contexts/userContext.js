import Cookies from 'js-cookie';
import { createContext, useState } from 'react';
import { io } from 'socket.io-client';

// Create the context
const UserContext = createContext();
// Create a provider component
export const UserContextProvider = ({ children }) => {
  const token = Cookies.get('token') || '';
  const [userData, setUserData] = useState({ token });

  // Define any functions or state variables that you want to share
  const ENDPOINT = 'http://localhost:8000/';

  // Move useState call to a separate function
  const [socket, setSocket] = useState(() => {
    const socket = io(ENDPOINT, {
      query: {
        token: userData.token,
      },
    });

    socket.on('connect', () => {
      console.log('connected');
    });

    return socket;
  });

  return (
    <UserContext.Provider value={{ userData, setUserData, socket }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
