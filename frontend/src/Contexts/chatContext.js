import { createContext, useContext, useState } from 'react';

// Create the context
const ChatContext = createContext();
// const getData = async () => {
//   await axios.post('http://localhost:8000/ask', {
//       pdf: 'GunjanSoralResume.pdf',
//       chat: 'newchat',
//       question: text
//     }, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });
// }


// Create a provider component
export const ChatContextProvider = ({ children }) => {
  const [chatInfo, setChatInfo] = useState({
    pdf: 'GunjanSoralResume.pdf',
    chat: 'newchat'
  });
  const [chats, setChats] = useState({});


  // Define any functions or state variables that you want to share

  return (
    <ChatContext.Provider value={{
      chatInfo, setChatInfo,
      chats, setChats
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;