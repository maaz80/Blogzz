import React from 'react'
import { useDispatch } from 'react-redux'
import authService from "../../appwrite/auth"
import { logout } from '../../store/authSlice'

const LogoutBtn = () => {
    const dispatch = useDispatch()
    const logoutHandler=()=>{
        authService.logout().then(()=>{
            dispatch(logout())
        })
    }
    return (
        <button className='inline-bock px-6 py-2 duration-200 hover:bg-rose-200 md:hover:bg-rose-600 rounded-b-md md:rounded-full w-full ' onClick={logoutHandler}>Logout</button>
    )
}

export default LogoutBtn
