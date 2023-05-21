import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage'
import './App.css';
import Home from './Pages/Home';
import { MessagesContextProvider } from './Contexts/messagesContext';
import { UserContextProvider } from './Contexts/userContext';

function App() {

  return (
    <UserContextProvider>
      <MessagesContextProvider>
        <Routes >
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </MessagesContextProvider>
    </UserContextProvider>
  );
}

export default App;
