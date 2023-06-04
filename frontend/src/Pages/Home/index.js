import { useContext, useEffect, useRef } from 'react'
import './style.css'
import MessagesContext from '../../Contexts/messagesContext';
import UserContext from '../../Contexts/userContext';
import ChatContext from '../../Contexts/chatContext';
import { useNavigate } from 'react-router-dom';
import Chats from '../../Components/Chats';
import Messages from '../../Components/Messages';

const Home = () => {
  const navigate = useNavigate()

  const messageContainerRef = useRef(null);

  const { userData, socket } = useContext(UserContext);
  const { chatInfo } = useContext(ChatContext);
  const { setMessages } = useContext(MessagesContext);

  useEffect(() => {
    const setData = async () => {

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

    <div className="home-container">
      <div className="home-left">
        <Chats />
      </div>
      <div className="home-right">
        <Messages />
      </div>
    </div>
  )
}

export default Home