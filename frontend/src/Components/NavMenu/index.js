import { useRef, useState } from 'react';
import './style.css';
import { FiLogOut, FiSun, FiMoon, FiFileText } from 'react-icons/fi';
import { CiMenuKebab } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useClickOutside from '../../CustomHooks/useClickOutside';

const NavMenu = () => {
  const navMenuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Define isDarkMode state
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  const handleChangeTheme = () => {
    setIsDarkMode(!isDarkMode); // Toggle isDarkMode state
    // Implement your theme change logic here
    // Example: toggle between light and dark mode
  };

  useClickOutside(navMenuRef, () => {
    setIsOpen(false)
  })

  return (
    <div ref={navMenuRef} className="nav-menu">
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        <CiMenuKebab size='20' />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <button className="menu-item" onClick={handleLogout}>
            <FiLogOut />
            Logout
          </button>
          <button className="menu-item" onClick={handleChangeTheme}>
            {isDarkMode ? <FiSun /> : <FiMoon />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link to="/pdfs" className="menu-item">
            <FiFileText />
            PDFs
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
