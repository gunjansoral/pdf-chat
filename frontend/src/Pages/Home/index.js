import { useContext, useEffect, useState } from 'react'
import './style.css'
import axios from 'axios';
import Message from '../../Components/Message';
import MessagesContext from '../../Contexts/messagesContext';
import UserContext from '../../Contexts/userContext';
import SendMessage from '../../Components/SendMessage';
import Cookies from 'js-cookie';

const Home = () => {
  const { messages, setMessages } = useContext(MessagesContext);
  const { userData, setUserData } = useContext(UserContext);

  const getUserData = async (token) => {
    const response = await axios.get('http://localhost:8000/user',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          // "Connection": 'keep-alive',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    const { name, email, picture, lastPdf, lastChat } = response.data;
    setUserData({ ...userData, name, email, picture, lastPdf, lastChat });
  }

  const getChats = async (token) => {
    const chats = await axios.get('http://localhost:8000/messages', {
      params: {
        chat: "newchat",
        pdf: "GunjanSoralResume.pdf"
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        // "Connection": 'keep-alive',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    setMessages(chats.data);
  }
  useEffect(() => {
    const Token = Cookies.get('token');
    getUserData(Token)
    getChats(Token)
  }, []);
  return (
    <div className="home-container">
      <div className="home-left"></div>
      <div className="home-right">
        {messages && <div className="messages-container">
          {messages?.map((element, index) => (
            <Message key={index} data={element} />
          ))}
        </div>}
        <SendMessage placeholder={"ask any question"} />
      </div>
    </div>
  )
}

export default Home