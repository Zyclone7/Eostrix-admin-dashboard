import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../features/auth/authServer';
import DashboardLayout from '../components/Layout';

const CreateUsers = ({ userId }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    course: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const userData = await authService.getUserById(userId);
          setFormData({
            firstName: userData.firstName,
            secondName: userData.secondName,
            email: userData.email,
            course: userData.course,
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const courseIdMap = {
      'Information Technology': 'C01',
      Education: 'C02',
      Accountancy: 'C03',
    };

    const courseId = courseIdMap[formData.course] || 'C00';

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      if (userId) {
        await authService.updateUser(userId, { ...formData, courseId }, config);
        toast.success('User updated successfully!');
      } else {
        await authService.createUser({ ...formData, courseId }, user.token);
        toast.success('User created successfully!');
      }

      setFormData({
        firstName: '',
        secondName: '',
        email: '',
        course: '',
      });
    } catch (error) {
      toast.error('Operation failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          className="z-50"
        />
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                {userId ? 'Update User Profile' : 'Create New User'}
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label 
                      htmlFor="firstName" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="secondName" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="secondName"
                      type="text"
                      name="secondName"
                      value={formData.secondName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                    />
                  </div>
                </div>

                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="course" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Course
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out"
                  >
                    <option value="">Select a course</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Education">Education</option>
                    <option value="Accountancy">Accountancy</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading && (
                      <svg 
                        className="animate-spin h-5 w-5 mr-3" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {isLoading ? 'Saving...' : userId ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateUsers;