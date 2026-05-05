import React from 'react'
import logo from '../assets/NextFolioLogo.png'
import './Navbar.css'
import Button from './Components/Button/Button'
import Profile from './Components/Profile/Profile'
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo-tooltip" tabIndex={0} aria-label="NextFolio logo">
        <img src={logo} alt="NextFolio" className="logo" />
        <span>BUILD TODAY. IMPRESS TOMORROW.</span>
      </div>
      <Button text="About" onClick={() => navigate('/about')} />
      <Button text="Contact" onClick={() => navigate('/contact')} />
      <Button text="Log In / Sign Up" />
      <Profile/>

    </div>
  )
}

export default Navbar
