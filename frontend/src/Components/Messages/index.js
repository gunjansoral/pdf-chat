import { useContext, useEffect, useRef, useState } from 'react';
import SendMessage from '../SendMessage';
import './style.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../Contexts/userContext';
import ChatContext from '../../Contexts/chatContext';
import MessagesContext from '../../Contexts/messagesContext';
import axios from 'axios';
import Message from '../Message';
import Cookies from 'js-cookie';
const ENDPOINT = 'http://localhost:8000';
const Messages = () => {
  const navigate = useNavigate()

  const [text, setText] = useState('');
  const messageContainerRef = useRef(null);

  const { userData, setUserData, socket } = useContext(UserContext);
  const { chatInfo, setChatInfo } = useContext(ChatContext);
  const { messages, setMessages } = useContext(MessagesContext);

  const getUserData = async (token) => {
    const response = await axios.get(`${ENDPOINT}/user`,
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

  const sendMessage = () => {
    socket.emit('message', {
      pdf: chatInfo.pdf,
      chat: chatInfo.chat,
      question: text
    })
    setText('')
  }

  useEffect(() => {
    const setData = async () => {
      const Token = Cookies.get('token');

      getUserData(Token)

      socket.emit('messages', chatInfo);
      socket.on('messages recieved', (data) => {
        setMessages(data)
      })
      socket.on('message', (data) => {
        setMessages((prev) => [...prev, data])
      })
    }
    if (!userData.token)
      navigate('/login')
    else
      setData()

    // Scroll to the bottom when messages change or component mounts
    messageContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [])
  return (
    <div className='messages-main-container'>
      {messages && <div className="messages-container"
        ref={messageContainerRef}
      >
        {messages?.map((element, index) => (
          <Message key={index} data={element} />
        ))}
      </div>}
      <SendMessage sendMessage={sendMessage} text={text} setText={setText} placeholder={"ask any question"} />
    </div>
  );
};

export default Messages;