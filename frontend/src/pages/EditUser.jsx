import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TextField,
  Button,
  CircularProgress
} from '@mui/material'

function EditUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [userData, setUserData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    course: '',
  })
  const [loading, setLoading] = useState(true)
  const [userHistory, setUserHistory] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchUserData = async () => {
      try {
        const token = user.token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const response = await axios.get(`http://localhost:5001/api/admin/${id}`, config)
        setUserData(response.data)
        // Mock history data - replace with actual API call if available
        setUserHistory([
          { date: '2024-01-01', action: 'Profile Updated', details: 'Changed email' },
          { date: '2024-01-15', action: 'Course Changed', details: 'Switched to Advanced' },
          { date: '2024-02-01', action: 'Name Updated', details: 'Updated last name' },
        ])
        setLoading(false)
      } catch (error) {
        toast.error('Failed to fetch user data')
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id, user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = user.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await axios.put(`http://localhost:5001/api/admin/${id}`, userData, config)
      toast.success('User updated successfully!')  // Display success message
      navigate('/')  // Redirect to another page after update
    } catch (error) {
      toast.error('Failed to update user')  // Display error message if update fails
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
        <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit User</h2>
      
      {/* Edit Form */}
      <Paper className="p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="First Name"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
            />
            <TextField
              label="Last Name"
              name="secondName"
              value={userData.secondName}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
            />
            <TextField
              label="Course"
              name="course"
              value={userData.course}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="bg-white"
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <Button 
              variant="contained" 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update User
            </Button>
          </div>
        </form>
      </Paper>

      {/* User History Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">User History</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">Date</TableCell>
                <TableCell className="font-semibold">Action</TableCell>
                <TableCell className="font-semibold">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userHistory.map((history, index) => (
                <TableRow 
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>{history.date}</TableCell>
                  <TableCell>{history.action}</TableCell>
                  <TableCell>{history.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
    </>
  )
}

export default EditUser
