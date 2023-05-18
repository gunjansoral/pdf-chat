import React from 'react'

const Message = ({ message }) => {
  return (
    <div className="message_container">
      <div className="message_left">
        <div className="avatar"></div>
      </div>
      <div className="message_right">
        {message}
      </div>
    </div>
  )
}

export default Message