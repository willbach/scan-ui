import React, { useCallback, useEffect, useState } from 'react'

import useDocketState from '../../store/docketStore'
import { PALS_APP, PALS_HOST } from '../../utils/constants'
import useScanStore from '../../store/scanStore'
import Modal from './Modal'
import Text from '../text/Text'
import Col from '../spacing/Col'
import Row from '../spacing/Row'
import Button from '../form/Button'
import Loader from './Loader'
import Form from '../form/Form'
import Input from '../form/Input'
import api from '../../api'

export const PalsPopup = () => {
  const { addAlly, requestTreaty, installDocket } = useDocketState.getState()
  const { palsPopupShip, showPalsPopup, setPalsPopupShip, addPal } = useScanStore()
  const [isInstalling, setIsInstalling] = useState(false)
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [tag, setTag] = useState('')

  useEffect(() => {
    const checkPalsInstallation = async () => {
      try {
        await api.scry({ app: 'pals', path: '/json' });
        setInstalled(true)
      } catch (err) {
        setInstalled(false)
        setShowInstallModal(true)
      }
    }

    checkPalsInstallation()
  }, [])

  const handleInstall = useCallback(async () => {
    setIsInstalling(true)
    try {
      await addAlly(PALS_HOST)
      await requestTreaty(PALS_HOST, PALS_APP)
      await installDocket(PALS_HOST, PALS_APP)
    } catch (err) {
      console.warn('PALS INSTALL ERROR:', err)
    } finally {
      setIsInstalling(false)
      setShowInstallModal(false)
    }
  }, [setIsInstalling, setShowInstallModal, addAlly, requestTreaty, installDocket])

  const submit = useCallback(async (e) => {
    e.preventDefault()

    try {
      if (palsPopupShip) {
        await addPal(palsPopupShip, [tag || 'handshake'])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setPalsPopupShip()
      setTag('')
    }
  }, [palsPopupShip, tag, addPal, setPalsPopupShip])

  if (showPalsPopup && !installed) {
    return (
      <Modal show={showInstallModal} hide={() => setShowInstallModal(false)}>
        {isInstalling ? (
        <Row style={{ width: '80%' }}>
          <Loader />
          <Text style={{ marginLeft: 16 }}>Installing...</Text>
        </Row>
      ) : (
          <Col style={{ borderRadius: 4, alignItems: 'center' }}>
            <Text>You can use the pals app to add <Text mono>{palsPopupShip}</Text> as a pal!</Text>
            <Text style={{ marginTop: 8, textAlign: 'center' }}>You do not have <Text mono>%pals</Text> installed,<br /> would you like to install it?</Text>
            <Row style={{ marginTop: 16 }}>
              <Button variant='dark' onClick={() => setShowInstallModal(false)} >Cancel</Button>
              <Button style={{ marginLeft: 16 }} onClick={handleInstall}>Install</Button>
            </Row>
          </Col>
      )}
      </Modal>
    )
  }

  return (
    <Modal show={showPalsPopup} hide={() => setPalsPopupShip()}>
      <Form onSubmit={submit} style={{ display: 'contents' }}>
        <Col style={{ alignItems: "center" }}>
          <Text style={{ marginBottom: 16 }}>Add {palsPopupShip} as a pal with tag</Text>
          <Input placeholder="handshake" value={tag} onChange={(e: any) => setTag(e.target.value)} />
          <Button type="submit" style={{ marginTop: 16 }}>Add Pal</Button>
        </Col>
      </Form>
    </Modal>
  )
}
