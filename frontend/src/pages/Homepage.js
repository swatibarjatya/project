import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';
import img from '../images/SalePoster.png';
function Homepage() {
  return (
    <div className='homepage_poster'>
      <img className='homepage_img' src={img} alt='Sale Poster' />
      <Link className='homepage_button' to='/productsList'>
        Shop now
      </Link>
    </div>
  );
}

export default Homepage;
