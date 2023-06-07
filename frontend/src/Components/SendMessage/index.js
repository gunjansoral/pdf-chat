import './style.css'
import { AiOutlineSend } from 'react-icons/ai'

const SendMessage = ({ placeholder, sendMessage, setText, text }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.target.tagName === 'DIV') {
      sendMessage();
    }
  };

  return (
    <div className="send-message-container">
      <input
        type="text"
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        value={text}
        onKeyDown={handleKeyDown} // Added keydown event handler
      />
      {text === '' ? (
        <div className="send-icon">
          <AiOutlineSend color="#111" />
        </div>
      ) : (
        <div className="send-icon" onClick={sendMessage}>
          <AiOutlineSend />
        </div>
      )}
    </div>
  );
}

export default SendMessage;
