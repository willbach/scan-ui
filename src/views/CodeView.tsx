import React, { useEffect, useState } from 'react'
import { IoIosRefresh } from 'react-icons/io';
import QRCode from "react-qr-code";
import Col from '../components/spacing/Col';
import Container from '../components/spacing/Container'
import Text from '../components/text/Text';
import useScanStore from '../store/scanStore'
import logo from '../assets/img/logo192.png'
import './CodeView.scss'
import Row from '../components/spacing/Row';

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
      return 'Loading...'
    } else if (!code) {
      return 'Please generate a code.'
    } else if (diff <= 0) {
      return 'Expired. Please refresh below.'
    }
    return `Expires in ${Math.floor(diff / 60)}:${padSeconds(diff % 60)}`
  }

  const textColor = !loading && code && diff < 60 ? 'red' : undefined

  return (
    <Container className="code-view">
      <h2>~{window.ship}</h2>
      {code ? (
        <Col style={{ padding: 4, background: 'white', marginBottom: 24, alignItems: 'center' }}>
          <QRCode value={code} />
          <Text style={{ marginTop: 24, color: textColor }}>{expiration(code, diff, loading)}</Text>
        </Col>
      ) : (
        <Col>
          <IoIosRefresh size={40} style={{ cursor: 'pointer' }} onClick={createCode} />
        </Col>
      )}
      {code && (
        <IoIosRefresh size={40} style={{ cursor: 'pointer' }} onClick={createCode} />
      )}
      <Row className="uqbar-experience">
        <img src={logo} alt="Uqbar Logo" />
        <Text>An Uqbar Experience</Text>
      </Row>
    </Container>
  )
}

export default CodeView
