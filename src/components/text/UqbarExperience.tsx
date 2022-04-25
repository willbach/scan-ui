import React from 'react'
import Row from '../spacing/Row'
import Text from './Text'
import logo from '../../assets/img/logo192.png'
import './UqbarExperience.scss'
import Link from '../nav/Link'

interface UqbarExperienceProps extends React.HTMLAttributes<HTMLDivElement> {

}

const UqbarExperience: React.FC<UqbarExperienceProps> = (props) => {
  return (
    <Link href="https://uqbar.network" target="_blank" className="uqbar-experience">
      <Row>
        <img src={logo} alt="Uqbar Logo" />
        <Text>An Uqbar Experience</Text>
      </Row>
    </Link>
  )
}

export default UqbarExperience
