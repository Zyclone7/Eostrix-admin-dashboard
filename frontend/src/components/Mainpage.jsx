import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Pencil, Trash2, Filter, ArrowUpDown } from 'lucide-react';

function Mainpage({}) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [courseTotals, setCourseTotals] = useState({});

  const getCourseStyles = (course) => {
    const courseLC = (course || '').toLowerCase();
    const courseColorMap = {
      'information technology': {
        bg: 'bg-indigo-50 hover:bg-indigo-100',
        text: 'text-indigo-700',
        accent: 'bg-indigo-500'
      },
      'education': {
        bg: 'bg-emerald-50 hover:bg-emerald-100',
        text: 'text-emerald-700',
        accent: 'bg-emerald-500'
      },
      'accountancy': {
        bg: 'bg-amber-50 hover:bg-amber-100',
        text: 'text-amber-700',
        accent: 'bg-amber-500'
      },
      'default': {
        bg: 'bg-slate-50 hover:bg-slate-100',
        text: 'text-slate-700',
        accent: 'bg-slate-500'
      }
    };

    const courseStyle = courseColorMap[courseLC] || courseColorMap['default'];
    return courseStyle;
  };

  const columns = [
    { field: 'firstName', headerName: 'First Name', width: 'w-32' },
    { field: 'secondName', headerName: 'Last Name', width: 'w-32' },
    { field: 'email', headerName: 'Email', width: 'w-64' },
    {
      field: 'course',
      headerName: 'Course',
      width: 'w-32',
      getValue: (row) => {
        const course = row.course || 'Unidentified';
        const courseStyle = getCourseStyles(course);
        return (
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${courseStyle.accent}`}></span>
            <span className={`font-medium ${courseStyle.text}`}>{course}</span>
          </div>
        );
      },
    },
    {
      field: 'totalTimeSpent',
      headerName: 'Total Time Spent',
      width: 'w-40',
      getValue: (row) => `${row.totalTimeSpent || 'N/A'}`,
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!user?.token) {
          throw new Error('No authentication token available');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data: usersData } = await axios.get('http://localhost:5001/api/admin/all', config);

        const usersWithTime = await Promise.all(
          usersData.map(async (userData) => {
            try {
              const { data: timeData } = await axios.get(
                `http://localhost:5002/api/time-spent/${userData._id}`,
                config
              );
              return { ...userData, totalTimeSpent: timeData.totalTimeSpent || 0 };
            } catch (error) {
              console.error(`Failed to fetch time for user ${userData._id}:`, error);
              return { ...userData, totalTimeSpent: 'N/A' };
            }
          })
        );

        setUsers(usersWithTime);
        calculateCourseTotals(usersWithTime);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && user.role === 'admin') {
      fetchUsers();
    } else if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      // Step 1: Fetch user data to ensure user and associated IDs are available
      const { data: userData } = await axios.get(`http://localhost:5001/api/admin/${userId}`, config);
  
      if (!userData || !userData._id) {
        throw new Error('User data could not be retrieved.');
      }
  
      // Step 2: Delete the time-spent data for the user
      await axios.delete(`http://localhost:5002/api/time-spent/${userData._id}`, config);
  
      // Step 3: Delete the user
      await axios.delete(`http://localhost:5001/api/admin/${userId}`, config);
  
      // Step 4: Update the state with the remaining users
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      calculateCourseTotals(updatedUsers);
  
      alert('User and associated time-spent data deleted successfully.');
    } catch (error) {
      console.error('Error deleting user or time-spent data:', error);
      alert('Failed to delete user or associated time-spent data. Please try again.');
    }
  };
  
  
  

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === 'N/A') return 1;
    if (bValue === null || bValue === 'N/A') return -1;

    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const paginatedUsers = sortedUsers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
          <h3 className="text-xl font-semibold text-slate-700">Loading users...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="p-6 bg-gradient-to-r from-indigo-50 via-indigo-100 to-slate-100 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Filter className="w-6 h-6 text-indigo-600" />
              User Management
            </h2>
            <div className="flex gap-4">
              {['Information Technology', 'Education', 'Accountancy', 'Other'].map((course) => {
                const courseStyle = getCourseStyles(course);
                return (
                  <div key={course} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${courseStyle.accent}`}></div>
                    <span className="text-sm text-slate-700">{course}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {users.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.field}
                        className={`p-4 text-left border-b border-slate-200 font-semibold text-slate-700 ${column.width}`}
                        onClick={() => handleSort(column.field)}
                      >
                        <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors">
                          {column.headerName}
                          {sortField === column.field ? (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="w-4 h-4" /> : 
                              <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ArrowUpDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="p-4 text-left border-b border-slate-200 font-semibold text-slate-700 w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => {
                    const courseStyle = getCourseStyles(user.course);
                    return (
                      <tr 
                        key={user._id} 
                        className={`transition-all duration-200 ${courseStyle.bg} hover:shadow-sm`}
                      >
                        {columns.map((column) => (
                          <td key={column.field} className="p-4 border-b border-slate-200 text-slate-700">
                            {column.getValue ? column.getValue(user) : user[column.field]}
                          </td>
                        ))}
                        <td className="p-4 border-b border-slate-200">
                          <div className="flex gap-3">
                            <button
                              onClick={() => navigate(`/edit/${user._id}`)}
                              className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                              title="Edit user"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-rose-600 hover:text-rose-800 p-2 rounded-full hover:bg-rose-100 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                </select>
                <span className="text-sm text-slate-600">
                  Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, users.length)} of {users.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(users.length / pageSize) - 1, currentPage + 1))}
                  disabled={currentPage >= Math.ceil(users.length / pageSize) - 1}
                  className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-slate-600 text-lg">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mainpage;