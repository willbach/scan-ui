// React.HTMLProps<HTMLButtonElement>
import React from 'react'
import './Button.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button {...props} className={`button ${props.className || ''}`}>
      {props.children}
    </button>
  )
}

export default Button
