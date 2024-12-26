import React, { useState, useEffect } from 'react';
import authService from '../features/auth/authServer'; // Adjust the path as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUsers = ({ userId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    course: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load user data for update if userId is provided
  useEffect(() => {
    if (userId) {
      // Fetch user data from the backend and pre-fill the form (this is just an example)
      const fetchUserData = async () => {
        try {
          const user = await authService.getUserById(userId);
          setFormData({
            firstName: user.firstName,
            secondName: user.secondName,
            email: user.email,
            course: user.course,
          });
        } catch (error) {
          toast.error('Failed to load user data.');
          console.error(error);
        }
      };
      fetchUserData();
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Generate course ID based on selected course
    const courseIdMap = {
      'Information Technology': 'C01',
      'Education': 'C02',
      'Accountancy': 'C03',
    };
    
    const courseId = courseIdMap[formData.course] || 'C00'; // Default to 'C00' if no match
    
    try {
      if (userId) {
        // Update user if userId is provided
        await authService.updateUser(userId, { ...formData, courseId });
        toast.success('User updated successfully!');
      } else {
        // Register new user if no userId is provided
        await authService.register({ ...formData, courseId });
        toast.success('User registered successfully!');
      }
      setFormData({
        firstName: '',
        secondName: '',
        email: '',
        course: '',
      });
    } catch (error) {
      toast.error('Operation failed. Please try again.');
      console.error(error); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">{userId ? 'Update User' : 'Create New User'}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="secondName"
                  value={formData.secondName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a course</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Education">Education</option>
                <option value="Accountancy">Accountancy</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : userId ? 'Update User' : 'Create User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUsers;
