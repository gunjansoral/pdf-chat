import { useContext, useState } from 'react';
import './style.css'
import { AiOutlineSend } from 'react-icons/ai'
import axios from 'axios';
import UserContext from '../../Contexts/userContext';


const SendMessage = ({ placeholder, sendMessage, setText, text }) => {
  const [sendBoxText, setSendBoxText] = useState('');
  const { userData } = useContext(UserContext);
  const { token } = userData;

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