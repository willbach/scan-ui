import React, { useState } from 'react'
import Button from '../components/form/Button'
import Form from '../components/form/Form'
import Input from '../components/form/Input'
import Container from '../components/spacing/Container'
import Row from '../components/spacing/Row'
import Text from '../components/text/Text'
import useScanStore from '../store/scanStore'
import { TokenBalance } from '../types/TokenBalance'

import './VerifyView.scss'

const VerifyView = () => {
  return (
    <Container className='verify-view'>
      <h2>Verify Code</h2>
    </Container>
  )
}

export default VerifyView
