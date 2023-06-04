import './style.css'
import { AiOutlineSend } from 'react-icons/ai'

const SendMessage = ({ placeholder, sendMessage, setText, text }) => {
  return (
    <div className="send-message-container">
      <input type="text"
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        value={text}
      />
      {text === '' ? (<div className="send-icon"  >
        <AiOutlineSend color='#111' />
      </div>) :
        (<div className="send-icon" onClick={sendMessage} >
          <AiOutlineSend />
        </div>)}
    </div>
  )
}

export default SendMessage