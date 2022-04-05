import React, { useEffect, useState } from 'react'
import { IoIosRefresh } from 'react-icons/io';
import QRCode from "react-qr-code";
import Col from '../components/spacing/Col';
import Container from '../components/spacing/Container'
import Text from '../components/text/Text';
import useScanStore from '../store/scanStore'
import './CodeView.scss'

const padSeconds = (s: number) => `${s < 10 ? '0' : ''}${s}`
const calcDiff = (expiresAt: Date | null) => Math.round(((expiresAt?.getTime() || new Date().getTime()) - new Date().getTime()) / 1000)

const CodeView = () => {
  const { createCode, code, expiresAt } = useScanStore()
  const [diff, setDiff] = useState(calcDiff(expiresAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setDiff(calcDiff(expiresAt))
    }, 990)

    return () => clearInterval(interval)
  }, [expiresAt])

  const expiration = (diff: number) => diff <= 0 ?
    'Expired. Please refresh below.' :
    `Expires in ${Math.floor(diff / 60)}:${padSeconds(diff % 60)}`

  return (
    <Container className="code-view">
      <h2>~{window.ship}</h2>
      {code ? (
        <Col style={{ padding: 4, background: 'white', marginBottom: 24, alignItems: 'center' }}>
          <QRCode value={code.toString()} />
          <Text style={{ marginTop: 24, color: diff < 60 ? 'red' : undefined }}>{expiration(diff)}</Text>
        </Col>
      ) : (
        <Col>
          <IoIosRefresh size={40} style={{ cursor: 'pointer' }} onClick={createCode} />
        </Col>
      )}
      {code && (
        <IoIosRefresh size={40} style={{ cursor: 'pointer' }} onClick={createCode} />
      )}
    </Container>
  )
}

export default CodeView
