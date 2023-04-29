import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
function Header() {
  return (
    <>
      <Link className='header_title' to='/'>
        ScreenIt - Online Ticketing Application
      </Link>
    </>
  );
}

export default Header;
