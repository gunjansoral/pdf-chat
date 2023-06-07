import { useContext, useEffect, useState } from 'react';
import Chat from '../Chat';
import './style.css';
import ChatContext from '../../Contexts/chatContext';
import UserContext from '../../Contexts/userContext';

const Chats = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { chatInfo } = useContext(ChatContext);
  const { socket } = useContext(UserContext)
  const [chats, setChats] = useState([]);

  useEffect(() => {

    const getChats = async () => {
      socket.emit('getchats', chatInfo.pdf);
    };
    getChats();
  }, []);

  const handleChats = (data) => {
    setChats(data);
    setIsLoading(false)
  };

  socket.on('setchats', handleChats);


  return (
    <div className='chats-container'>
      <Chat newChat isLoading={isLoading} setIsLoading={setIsLoading} />
      {chats.length > 0 ? chats.map((chat, i) => (
        <Chat key={i} chat={chat} />
      )) : null}
    </div>
  );
};

export default Chats;
