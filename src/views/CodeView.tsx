import React, { useEffect, useState } from 'react'
import { IoIosRefresh } from 'react-icons/io'
import QRCode from "react-qr-code"
import Col from '../components/spacing/Col'
import Container from '../components/spacing/Container'
import Text from '../components/text/Text'
import UqbarExperience from '../components/text/UqbarExperience'
import useScanStore from '../store/scanStore'
import './CodeView.scss'

const padSeconds = (s: number) => `${s < 10 ? '0' : ''}${s}`
const calcDiff = (expiresAt: Date | null) => Math.round(((expiresAt?.getTime() || new Date().getTime()) - new Date().getTime()) / 1000)

const CodeView = () => {
  const { createCode, code, expiresAt, loading } = useScanStore()
  const [diff, setDiff] = useState(calcDiff(expiresAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setDiff(calcDiff(expiresAt))
    }, 990)

    return () => clearInterval(interval)
  }, [expiresAt])

  const expiration = (code: string, diff: number, loading: boolean) => {
    if (loading) {
      return <Text style={{ marginTop: 24, color: textColor }}>Loading...</Text>
    } else if (!code) {
      return <Text style={{ marginTop: 24, color: textColor }}>Please generate a code.</Text>
    } else if (diff <= 0) {
      return <Text style={{ marginTop: 24, color: textColor }}>Expired. Please refresh below.</Text>
    }
    return <Text style={{ marginTop: 24, color: textColor }}>
      Expires in <Text style={{ fontSize: 17 }} mono>{Math.floor(diff / 60)}:{padSeconds(diff % 60)}</Text>
    </Text>
  }

  const textColor = !loading && code && diff < 60 ? 'red' : undefined

  return (
    <Container className="code-view">
      <h2>~{window.ship}</h2>
      <Text style={{ lineHeight: '1.5em', marginBottom: 16, textAlign: 'center' }}>
        This code matches your Urbit ID and can be scanned <br /> by another handshake app using the Verify tab.
      </Text>
      {code ? (
        <Col style={{ padding: 4, background: 'white', marginBottom: 24, alignItems: 'center' }}>
          <QRCode value={code} />
          {expiration(code, diff, loading)}
        </Col>
      ) : (
        <Col style={{ height: 310, marginBottom: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </Col>
      )}
      <IoIosRefresh size={32} style={{ cursor: 'pointer' }} onClick={createCode} />
      <UqbarExperience />
    </Container>
  )
}

export default CodeView
