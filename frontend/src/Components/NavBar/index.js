import React from 'react';
import Cookies from 'js-cookie';
import './style.css';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  return (
    <div className="nav-container">
      <div className="menu-button"></div>
      <div onClick={handleLogOut} className="log-out-button">
        <span>Log out</span>
      </div>
    </div>
  );
};

export default NavBar;
