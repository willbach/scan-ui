import React, { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import Container from '../components/spacing/Container'
import useScanStore from '../store/scanStore'

import './VerifyView.scss'

const VerifyView = () => {
  const { verifyCode } = useScanStore()
  const [data, setData] = useState('No data')

  return (
    <Container className='verify-view'>
      <h2>Verify Code</h2>
      <QrReader
        onResult={(result, error) => {
          if (result) {
            setData(result.getText())
            const code = Number(result.getText())
            if (code.toString() !== 'NaN') {
              verifyCode(code);
            } else {
              console.warn('Not a number:', code);
            }
          } else if (error) {
            console.warn(error);
            setData(error.toString())
          }
        }}
        constraints={{ facingMode: 'user' }}
      />
      <p>{data}</p>
    </Container>
  )
}

export default VerifyView
