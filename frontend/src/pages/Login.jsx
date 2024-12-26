import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import Logo from '../assets/Logo.png'

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })
  const { identifier, password } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if (isSuccess || user) {
      if (user.role === 'admin') {
        navigate('/') 
      } else {
        toast.error('Only admins can log in.')
        dispatch(reset())
      }
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = {
      identifier,
      password,
    }
    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl flex shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side - Branding Section */}
        <div className="w-1/2 bg-[#203041] flex flex-col items-center justify-center p-12 text-white">
          <img src={Logo} alt="Brand Logo" className="w-32 h-32 mb-6" />
          <h1 className="text-3xl font-bold text-center mb-4">Welcome to Eostrix</h1>
          <p className="text-center text-gray-300">
            Secure access to your administrative dashboard
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 bg-white flex items-center justify-center p-12">
          <form onSubmit={onSubmit} className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-[#203041]">Admin Login</h2>
            <div className="mb-4">
              <label 
                htmlFor="identifier" 
                className="block text-[#203041] font-semibold mb-2"
              >
                Email or ID
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#203041]"
                placeholder="Enter your email or ID"
              />
            </div>
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className="block text-[#203041] font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#203041]"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#203041] text-white py-3 rounded-lg hover:bg-[#2a4056] transition duration-300 font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login