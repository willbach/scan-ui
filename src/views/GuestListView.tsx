import React, { useEffect, useRef, useState } from 'react'
import Button from '../components/form/Button'
import TextArea from '../components/form/TextArea'
import Modal from '../components/popups/Modal'
import Col from '../components/spacing/Col'
import Container from '../components/spacing/Container'
import useScanStore from '../store/scanStore'

import './GuestListView.scss'

const GuestListView = () => {
  const { setGuestList } = useScanStore()

  return (
    <Container className='guest-list-view'>
      <h2>Guest List</h2>
    </Container>
  )
}

export default GuestListView
