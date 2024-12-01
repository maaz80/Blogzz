import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from "./index"
import { useDispatch } from "react-redux"
import authService from '../appwrite/auth'
import { useForm } from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")

    const login = async (data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                
                if (userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen -mt-10'>
            <div className={`mx-auto w-full max-w-md bg-white backdrop-blur-lg rounded-xl p-3 md:p-10 border border-gray-200 shadow-xl`}>
                <div className="flex justify-center">
                </div>
                <h2 className="text-center text-3xl font-semibold leading-tight text-gray-800 mb-4">Sign in to your account</h2>
                <p className="text-center text-base text-gray-600 mb-6">
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary-500 hover:text-primary-700 transition-all duration-200 underline"
                    >
                        Sign Up
                    </Link>
                </p>

                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit(login)} className='space-y-6'>
                    <div className="space-y-4">
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            className='w-full px-4 py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            {...register("email", {
                                required: "Email is required",
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            className='w-full px-4 py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-3 text-white bg-rose-600 hover:bg-rose-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 "
                    >
                        Sign in
                    </Button>
                </form>

                <p className="text-center mt-1 text-gray-500 text-xs md:text-sm">
                    By signing in, you agree to our <Link to="/terms" className="text-blue-500 hover:text-blue-700 underline">Terms & Conditions</Link>.
                </p>
            </div>
        </div>
    )
}

export default Login;
