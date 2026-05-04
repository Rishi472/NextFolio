import React from 'react'
import logo from '../assets/NextFolioLogo.png'
import './Navbar.css'
import Button from './Components/Button/Button'
import Profile from './Components/Profile/Profile'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <div className="navbar">
      <img src={logo} alt="NextFolio" className="logo" />
      <Button text="About" />
      <Button text="Contact" />
      <Button text="Log In / Sign Up" />
      <Profile/>

    </div>
  )
}

export default Navbar
