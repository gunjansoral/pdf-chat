import './style.css'
import LoginButton from '../../Components/LoginButton'
import { useContext } from 'react'
import UserContext from '../../Contexts/userContext'

const LoginPage = ({ setIsLoggedIn }) => {
  const { userData } = useContext(UserContext)
  if (userData.token !== '')
    setIsLoggedIn(false)
  else
    setIsLoggedIn(true)
  return (
    <div className="login_container">
      <LoginButton />
    </div>
  )
}

export default LoginPage