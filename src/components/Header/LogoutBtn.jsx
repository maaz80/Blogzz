import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import Popup from '../Popup'
import { useNavigate } from 'react-router-dom'

const LogoutBtn = ({ classes }) => {
    const [isPopup, setIsPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            setIsPopup(true)
            setTimeout(() => {
                setIsPopup(false)
                navigate('/login')
                dispatch(logout())
                window.location.reload()
            }, 1000);
        })
    }

    return (<>
        {isPopup && <Popup children={'Logout Succesfull!!!'} />}

        <button className={`inline-bock px-7 py-2 duration-200 hover:bg-rose-200 md:hover:bg-rose-600/20 rounded-b-md md:rounded-full w-full ${classes}`} onClick={logoutHandler}>Logout</button>
    </>
    )
}

export default LogoutBtn
