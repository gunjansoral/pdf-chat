import Cookies from 'js-cookie';
import { createContext, useState } from 'react';

// Create the context
const UserContext = createContext();
// Create a provider component
export const UserContextProvider = ({ children }) => {
  const token = Cookies.get('token');
  const [userData, setUserData] = useState({ token })

  // Define any functions or state variables that you want to share

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;