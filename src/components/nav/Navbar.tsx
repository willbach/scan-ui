import React from 'react'
import Row from '../spacing/Row'
import Link from './Link'
import logoWithText from '../../assets/img/uqbar-logo-text.png'
import './Navbar.scss'

const Navbar = () => {

  return (
    <Row className='navbar'>
      <Link className={`nav-link ${window.location.pathname === '/' ? 'selected' : ''}`} href="/">Code</Link>
      <Link className={`nav-link ${window.location.pathname.includes('/verify') ? 'selected' : ''}`} href="/verify">Verify</Link>
      <Link className={`nav-link ${window.location.pathname === '/guest-list' ? 'selected' : ''}`} href="/guest-list">Guest List</Link>
    </Row>
  )
}

export default Navbar
