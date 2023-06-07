import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import UserContext from '../../Contexts/userContext';
import ChatContext from '../../Contexts/chatContext';
import Chats from '../../Components/Chats';
import Messages from '../../Components/Messages';

const Home = () => {
  const navigate = useNavigate();
  const messageContainerRef = useRef(null);
  const { userData, socket } = useContext(UserContext);
  const { chatInfo } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userData.token) {
      navigate('/login');
    } else {
      socket.emit('messages', chatInfo);

      socket.on('message', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        // Clean up event listener when component unmounts
        socket.off('message');
      };
    }
  }, [userData.token, socket, chatInfo, navigate]);

  useEffect(() => {
    // Scroll to the bottom when messages change or component mounts
    messageContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  return (
    <div className="home-container">
      <div className="home-left">
        <Chats />
      </div>
      <div className="home-right">
        <Messages />
      </div>
      <div ref={messageContainerRef} />
    </div>
  );
};

export default Home;
