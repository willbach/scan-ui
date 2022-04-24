import React from 'react'
import Row from '../spacing/Row'
import Text from './Text'
import logo from '../../assets/img/logo192.png'
import './UqbarExperience.scss'

interface UqbarExperienceProps extends React.HTMLAttributes<HTMLDivElement> {

}

const UqbarExperience: React.FC<UqbarExperienceProps> = (props) => {
  return (
    <Row className="uqbar-experience">
      <img src={logo} alt="Uqbar Logo" />
      <Text>An Uqbar Experience</Text>
    </Row>
  )
}

export default UqbarExperience
