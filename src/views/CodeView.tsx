import React, { useEffect } from 'react'
import { IoIosRefresh } from 'react-icons/io';
import Container from '../components/spacing/Container'
import useScanStore from '../store/scanStore'

const CodeView = () => {
  const { createCode, code } = useScanStore()

  return (
    <Container>
      <h2>Code</h2>
      {code ? (
        null
      ) : (
        <IoIosRefresh size={40} style={{ cursor: 'pointer' }} onClick={createCode} />
      )}
      {code && (
        <IoIosRefresh size={40} style={{ cursor: 'pointer' }} onClick={createCode} />
      )}
    </Container>
  )
}

export default CodeView
