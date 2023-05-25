import React, { useContext } from 'react'
import './style.css'
import { AiOutlineGoogle } from 'react-icons/ai'
import Cookies from 'js-cookie';

const LoginButton = () => {
  const handleLogin = async () => {
    window.location.href = 'http://localhost:8000/auth/google';
    const token = Cookies.get('token')
  }

  return (
    <div onClick={handleLogin} className="login_button_container">
      <div className="google_logo">
        <AiOutlineGoogle size='40' />
      </div>
      <span>Sign in with Google</span>
    </div>
  )
}

export default LoginButton