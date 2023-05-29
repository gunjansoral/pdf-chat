import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
import './App.css';
import Home from './Pages/Home';
import { MessagesContextProvider } from './Contexts/messagesContext';
import { UserContextProvider } from './Contexts/userContext';
import { ChatContextProvider } from './Contexts/chatContext';
import Pdfs from './Pages/Pdfs';
import NavBar from './Components/NavBar';

function App() {
  return (
    <UserContextProvider>
      <ChatContextProvider>
        <MessagesContextProvider>
          <NavBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/pdfs' element={<Pdfs />} />
          </Routes>
        </MessagesContextProvider>
      </ChatContextProvider>
    </UserContextProvider>
  );
}

export default App;
