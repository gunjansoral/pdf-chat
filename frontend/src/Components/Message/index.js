import './style.css'

const Message = ({ data }) => {
  const { name, picture, message } = data;
  return (
    <div className={`message_container ${name != 'PDFAssist' ? 'user' : ''}`} >
      <div className="message_left">
        <div className="avatar">
          <img src={picture} alt="" />
        </div>
      </div>
      <div className="message_right">
        {message.content}
      </div>
    </div>
  )
}

export default Message