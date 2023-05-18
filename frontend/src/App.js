import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
import './App.css';
import Cookies from 'js-cookie';
import axios from 'axios'
import { useEffect, useState } from 'react';

function App() {
  const [chats, setChats] = useState();
  const [token, setToken] = useState();
  const getChats = async () => {
    const chats = await axios.get('http://localhost:8000/chats', {
      userId: '1',
      chatId: 'newchat2',
      pdfId: '6456a4830bff2f7f4e35e6b2'
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: 'keep-alive',
        ContentType: 'application/json,'
      }
    });
    // console.log(chats)
    // setChats(chats)
  }
  useEffect(() => {
    const token = Cookies.get('token')
    setToken(token);
    getChats()
    console.log(token)
  }, []);
  return (
    <Routes >
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  );
}

export default App;
