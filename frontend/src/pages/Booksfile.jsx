import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from '../components/Spinner'
import DashboardLayout from '../components/Layout'
import BookFilePage from '../components/BookFilePage'


function Booksfile() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
  
    useEffect(() => {
      // Check if user is not logged in or not an admin
      if (!user || user.role !== 'admin') {
        navigate('/login')
      }
    }, [user, navigate])

  return (
   
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          </div>
          <div className="p-6">
         <BookFilePage/>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Booksfile