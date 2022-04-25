import React, { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { PalsPopup } from '../components/popups/PalsPopup'
import Container from '../components/spacing/Container'
import Text from '../components/text/Text'
import UqbarExperience from '../components/text/UqbarExperience'
import useScanStore from '../store/scanStore'

import './VerifyView.scss'

const VerifyView = () => {
  const { guestSuccess, verifyCode, setGuestSuccess } = useScanStore()
  const [data, setData] = useState('')

  useEffect(() => {
    if (guestSuccess) {
      setData('')
      setTimeout(() => setGuestSuccess(undefined), 3000)
    }
  }, [guestSuccess, setGuestSuccess])

  const canScan = window.location.origin.includes('https') || window.location.origin.includes('localhost')

  return (
    <Container className='verify-view'>
      <h2>Verify Code</h2>
      {!canScan && (
        <Text style={{ lineHeight: '1.5em', marginBottom: 16, textAlign: 'center' }}>
          You must be connected through https or on<br/> a local network to use your camera to scan.
        </Text>
      )}
      <QrReader
        videoId="code-reader"
        containerStyle={{ height: 240, width: 320 }}
        videoContainerStyle={{ height: 240, width: 320 }}
        videoStyle={{ height: 240, width: 320 }}
        onResult={(result, error) => {
          if (result) {
            setData('Confirming...')
            verifyCode(result.getText())
          } else if (error) {
            setData('Please focus on the QR code')
          }
        }}
        constraints={{ facingMode: 'environment' }}
      />
      <p>{data}</p>
      {guestSuccess && <Text>{guestSuccess}</Text>}
      <PalsPopup />
      <UqbarExperience style={{ marginTop: 16 }} />
    </Container>
  )
}

export default VerifyView
