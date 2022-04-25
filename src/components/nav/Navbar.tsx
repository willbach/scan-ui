import React from 'react'
import Row from '../spacing/Row'
import Link from './Link'
import { BASENAME } from '../../utils/constants'
import './Navbar.scss'

const Navbar = () => {

  return (
    <Row className='navbar'>
      <Link className={`nav-link ${window.location.pathname === BASENAME + '/' ? 'selected' : ''}`} href={`${BASENAME}/`}>Code</Link>
      <Link className={`nav-link ${window.location.pathname.includes('/verify') ? 'selected' : ''}`} href={`${BASENAME}/verify`}>Verify</Link>
      <Link className={`nav-link ${window.location.pathname.includes('/guest-list') ? 'selected' : ''}`} href={`${BASENAME}/guest-list`}>Guest List</Link>
    </Row>
  )
}

export default Navbar
