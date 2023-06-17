import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
import './App.css';
import Home from './Pages/Home';
import { MessagesContextProvider } from './Contexts/messagesContext';
import { UserContextProvider } from './Contexts/userContext';
import { ChatContextProvider } from './Contexts/chatContext';
import Pdfs from './Pages/Pdfs';
import { useState } from 'react';
import NavBar from './Components/NavBar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <UserContextProvider>
      <ChatContextProvider>
        <MessagesContextProvider>
          {isLoggedIn && <NavBar />}
          <Routes>
            <Route path='/' element={<Home setIsLoggedIn={setIsLoggedIn} />} />
            <Route path='/login' element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path='/pdfs' element={<Pdfs setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </MessagesContextProvider>
      </ChatContextProvider>
    </UserContextProvider>
  );
}

export default App;
