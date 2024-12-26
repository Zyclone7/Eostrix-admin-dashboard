import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DashboardLayout from '../components/Layout';
import UsersTable from '../components/UsersTable';
import CoursePieChart from '../components/CoursePieChart';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  ClockIcon, 
  UserGroupIcon,
  DocumentReportIcon 
} from '@heroicons/react/solid'; // Switched to solid icons for more modern look

const courseMapping = {
  C01: { name: 'Information Technology', color: '#6366F1' }, // Indigo
  C02: { name: 'Education', color: '#EC4899' }, // Pink
  C03: { name: 'Accountancy', color: '#10B981' }, // Emerald
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [ebookTimeData, setEbookTimeData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [books, setBooks] = useState([]);


  const handleUserData = (users) => {
    setTotalUsers(users.length);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        // Check for admin role
        if (user.role !== 'admin') {
          navigate('/login');
          return;
        }
    
        const booksResponse = await axios.get('http://localhost:5003/api/files', config); // Fetch books
        const timeSpentResponse = await axios.get('http://localhost:5002/api/time-spent/', config);
    
        const rawTimeSpentData = timeSpentResponse.data;
    
        // Parse and merge time spent by course
        const aggregatedData = rawTimeSpentData.reduce((acc, item) => {
          const course = courseMapping[item.courseId];
          
          const parseTimeSpent = (timeString) => {
            let totalMinutes = 0;
            const hourMatch = timeString.match(/(\d+)h/);
            const minuteMatch = timeString.match(/(\d+)m/);
    
            if (hourMatch) {
              totalMinutes += parseInt(hourMatch[1], 10) * 60;
            }
            if (minuteMatch) {
              totalMinutes += parseInt(minuteMatch[1], 10);
            }
    
            return totalMinutes;
          };
    
          const totalMinutes = parseTimeSpent(item.timeSpent);
          const courseName = course ? course.name : item.courseId;
    
          if (!acc[courseName]) {
            acc[courseName] = {
              name: courseName,
              timeSpent: 0,
              color: course ? course.color : '#8884d8',
            };
          }
    
          acc[courseName].timeSpent += totalMinutes;
    
          return acc;
        }, {});
    
        // Convert aggregated data to an array
        const timeSpentData = Object.values(aggregatedData);
    
        setEbookTimeData(timeSpentData);
        setBooks(booksResponse.data); // Update books state
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data from the API:', error.message);
        setLoading(false);
      }
    };
    

    fetchData();
  }, [user, token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Utility function to format time
  function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60); // Get hours
    const minutes = totalMinutes % 60; // Remaining minutes
    return `${hours}h ${minutes}m`;
  }

  return (
<DashboardLayout>
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {/* Header Section with refined styling */}
        <div className="flex justify-between items-center mb-8 bg-white shadow-lg rounded-xl p-6 border-l-4 border-indigo-500">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
          <div className="flex space-x-4">
            <button className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Generate Report
            </button>
            <button className="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Grid with elegant shadows and gradients */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={ClockIcon}
            title="Total Time Spent"
            value={formatTime(ebookTimeData.reduce((sum, entry) => sum + entry.timeSpent, 0))}
            color="text-indigo-500 bg-indigo-500/10"
            borderColor="border-indigo-500"
          />
          <StatCard 
            icon={UserGroupIcon}
            title="Total Students"
            value={totalUsers}
            color="text-pink-500 bg-pink-500/10"
            borderColor="border-pink-500"
          />
          <StatCard 
            icon={DocumentReportIcon}
            title="Epubs"
            value={books.length}
            color="text-emerald-500 bg-emerald-500/10"
            borderColor="border-emerald-500"
          />
        </div>

        {/* Charts Section with refined styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-xl p-6 border-l-4 border-indigo-500">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Ebook Time Spent (minutes)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ebookTimeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: '#475569' }} />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} tick={{ fill: '#475569' }} />
                <Tooltip 
                  cursor={{fill: 'rgba(99, 102, 241, 0.1)'}} 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    color: 'white', 
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="timeSpent" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {ebookTimeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="transition duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border-l-4 border-pink-500">
            <CoursePieChart />
          </div>
        </div>

        {/* Table Section with consistent styling */}
        <div className="mt-8 bg-white rounded-xl shadow-xl overflow-hidden border-l-4 border-emerald-500">
          <UsersTable onUserData={handleUserData} />
        </div>
      </div>
    </DashboardLayout>
  );
}

// Enhanced StatCard Component
function StatCard({ icon: Icon, title, value, color, borderColor }) {
  return (
    <div className={`rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-l-4 ${borderColor}`}>
      <div className="flex items-center">
        <div className={`mr-5 p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <p className="text-slate-500 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
      </div>
    </div>
  );
}