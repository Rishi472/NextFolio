import React from 'react'
import './Button.css'
const Button = (Props) => {
  return (
    <div>
        <button className="btn">{Props.text}</button>
    </div>
  )
}

export default Button
