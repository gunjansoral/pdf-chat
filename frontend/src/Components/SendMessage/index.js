import { useContext, useState } from 'react';
import './style.css'
import { AiOutlineSend } from 'react-icons/ai'
import axios from 'axios';
import UserContext from '../../Contexts/userContext';


const SendMessage = ({ placeholder }) => {
  const [text, setText] = useState('');
  const { userData } = useContext(UserContext);
  const { token } = userData;

  const handleClick = async () => {
    await axios.post('http://localhost:8000/ask', {
      pdf: 'GunjanSoralResume.pdf',
      chat: 'newchat',
      question: text
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
  return (
    <div className="send-message-container">
      <input type="text"
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        value={text}
      />
      <div className="send-icon" onClick={handleClick} >
        <AiOutlineSend />
      </div>
    </div>
  )
}

export default SendMessage