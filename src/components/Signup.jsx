import React, { useEffect, useState } from 'react'
import authService from '../appwrite/auth.js'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()

    const create = async (data) => {
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(login(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])
    return (
        <div className="flex items-center justify-center h-screen -mt-16">
            <div className={`mx-auto w-[95%] md:w-full max-w-md bg-white backdrop-blur-lg rounded-xl p-3 md:p-10 border border-gray-200 shadow-xl`}>
                <div className="mb-2 flex justify-center">
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight mb-5 ">Sign Up</h2>
                
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            className='w-full px-4 py-1 md:py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            {...register("name", {
                                required: true,
                                minLength: 10,
                                maxLength: 15
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            className='w-full px-4 py-1 md:py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            className='w-full px-4 py-1 md:py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            {...register("password", {
                                required: true,
                                minLength: 6
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full py-2 md:py-3 text-white bg-rose-600 hover:bg-rose-700 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 "
                        >
                            Create Account
                        </Button>
                        <p className=" text-end text-sm md:text-base text-black/60 mb-6">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Signup