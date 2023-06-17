import { AiOutlinePlus } from 'react-icons/ai'
import { BsChatFill } from 'react-icons/bs'
import './style.css'
import { useContext, useState } from 'react'
import UserContext from '../../Contexts/userContext'
import ChatContext from '../../Contexts/chatContext'
import ReactLoading from 'react-loading';

const Chat = ({ newChat, chat, isLoading, setIsLoading }) => {
  const { socket } = useContext(UserContext)
  const { chatInfo } = useContext(ChatContext)
  const [isActive, setIsActive] = useState(false)

  const handleNewChat = async () => {
    await setIsLoading(true)
    await socket.emit('getnewchat', chatInfo.pdf)
    setIsLoading(false)
  }

  return (
    <>
      {newChat ? isLoading ? <div className='loader-container'>
        <ReactLoading className='loader' type='bubbles' color='#fff' height={'15%'} width={'15%'} />
      </div> : (<div
        className='new-chat-container'
        onClick={handleNewChat}
      >
        <div className="new-chat-icon">
          <AiOutlinePlus size='25' />
        </div>
        <span className="new-chat-name">New chat</span>
      </div>) : <div
        className={`chat-container ${isActive && 'chat-active'}`}
        onClick={() => setIsActive(!isActive)}
      >
        <div className="chat-icon">
          <BsChatFill size='25' />
        </div>
        <span className="chat-name">{chat?.chatName}</span>
      </div>}
    </>
  )
}

export default Chat