import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-rose-50 poppins-regular'>
      <div className='w-full block'>
        <main className='  flex'>
          <Sidebar />            <div className='w-[15%] md:w-[260px]'></div>

          <div className='w-[85%]'>
            <Header />
            <Outlet />
      <Footer />
          </div>
        </main>
      </div>
    </div>
  ) : null
}

export default App
