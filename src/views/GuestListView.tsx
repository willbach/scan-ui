import React, { useCallback, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import Button from '../components/form/Button'
import Form from '../components/form/Form'
import Input from '../components/form/Input'
import Col from '../components/spacing/Col'
import Container from '../components/spacing/Container'
import Row from '../components/spacing/Row'
import Text from '../components/text/Text'
import useScanStore from '../store/scanStore'

import './GuestListView.scss'

const addSig = (s: string) => s.length === 0 ? '' : s[0] === '~' ? s : `~${s}`

const GuestListView = () => {
  const { guestList, setGuestList, clearGuestList } = useScanStore()
  const [guest, setGuest] = useState('')

  const addGuest = (e: any) => {
    e.preventDefault()

    if (guest.length > 3) {
      setGuestList(guestList.map(({ ship }) => ship).concat(guest))
      setGuest('')
    }
  }

  const removeGuest = useCallback((targetShip: string) => () => {
    setGuestList(guestList.map(({ ship }) => ship).filter(s => s !== targetShip))
  }, [guestList, setGuestList])

  return (
    <Container className='guest-list-view'>
      <Row style={{ justifyContent: 'space-between', width: 320 }}>
        <h2>Guest List</h2>
        {guestList.length > 0 && <Button onClick={clearGuestList}>Clear All</Button>}
      </Row>
      <Form onSubmit={addGuest} style={{ width: 'fit-content' }}>
        <Row>
          <Input
            value={guest}
            onChange={(e: any) => setGuest(addSig(e.target.value))}
            placeholder="Ship"
            style={{ padding: '4px 8px' }}
          />
          <Button type="submit" style={{ marginLeft: 16, padding: '4px 8px', color: 'white', background: 'black' }}>
            Add Guest
          </Button>
        </Row>
      </Form>
      <Col className="guests">
        {guestList.map(({ ship, confirmed }) => (
          <Row style={{ justifyContent: 'space-between', width: 'calc(100% - 16px)', padding: '8px 16px' }}>
            <Text mono className="ship">{ship}</Text>
            <Row>
              <Text>{confirmed ? 'Confirmed' : 'Pending'}</Text>
              <FaTrash size={16} className="trash" onClick={removeGuest(ship)} />
            </Row>
          </Row>
        ))}
      </Col>
    </Container>
  )
}

export default GuestListView
