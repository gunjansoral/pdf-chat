import React, { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import './style.css';
import { useNavigate } from 'react-router-dom';
import NavMenu from '../NavMenu';
import UserContext from '../../Contexts/userContext';

const NavBar = () => {
  return (
    <div className="nav-container">
      <div className="menu-button"></div>
      <div>
        <NavMenu />
      </div>
    </div>
  );
};

export default NavBar;
