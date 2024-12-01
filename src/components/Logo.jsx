import React from 'react'
import LogoImg from '../components/images/Logo.png'

const Logo = ({width ,height}) => {
  return (
    <div className={`${width} ${height} `}>
     <img src={LogoImg} alt="Logo"  className='w-full h-full'/>
    </div>
  )
}

export default Logo
