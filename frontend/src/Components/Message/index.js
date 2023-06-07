import { RiDeleteBin6Line } from 'react-icons/ri';
import './style.css'
import { useContext } from 'react';
import ChatContext from '../../Contexts/chatContext';

const Message = ({ data, socket }) => {
  const { name, picture, message } = data;
  const { chatInfo } = useContext(ChatContext);
  const deleteMessageData = { ...chatInfo, message }

  const handleDelete = () => {
    socket.emit('deletemessage', deleteMessageData)
  }
  return (
    <div className={`message_container ${name != 'PDFAssist' ? 'user' : ''}`} >
      <div className="message-inner-container">
        <div className="message_left">
          <div className="avatar">
            <img src={picture} alt="" />
          </div>
        </div>
        <div className="message_right">
          <span>{message.content}</span>
        </div>
      </div>
      <div className="message-outer-content">
        <div
          onClick={handleDelete}
          className="message-delete-button">
          <RiDeleteBin6Line />
        </div>
      </div>
    </div>
  )
}

export default Message