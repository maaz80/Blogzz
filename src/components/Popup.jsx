import React from 'react'

const Popup = ({children}) => {
  return (
    <div className="fixed z-50 text-white top-1/2 left-1/2 -translate-x-1/2 bg-rose-700 rounded-md  shadow-gray-800 w-60 h-20 flex justify-center items-center shadow-md transition-all duration-150 ease-in">
    {children}
    </div>
  )
}

export default Popup
