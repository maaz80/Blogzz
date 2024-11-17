import React from 'react'

const Logo = ({width = '100px' ,textColor}) => {
  return (
    <div className={`text-3xl font-semibold p-2.5 ${textColor}`}>
      Blogzz
    </div>
  )
}

export default Logo
