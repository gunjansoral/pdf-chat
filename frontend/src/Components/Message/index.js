import { RiDeleteBin6Line } from 'react-icons/ri';
import './style.css'

const Message = ({ data }) => {
  const { name, picture, message } = data;
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
        <div className="message-delete-button">
          <RiDeleteBin6Line />
        </div>
      </div>
    </div>
  )
}

export default Message