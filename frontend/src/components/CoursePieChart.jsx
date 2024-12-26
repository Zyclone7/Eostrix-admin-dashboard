import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Updated color palette to match dashboard aesthetic
const COLORS = {
  'Information Technology': '#6366F1', // Indigo
  'Education': '#EC4899',             // Pink
  'Accountancy': '#10B981',           // Emerald
  'Unidentified': '#F59E0B',         // Amber
  'default': '#94A3B8',              // Slate
};

function CoursePieChart() {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  // Aggregate users by courses
  const coursesCount = users.reduce((acc, curr) => {
    const course = curr.course || 'Unidentified';
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(coursesCount).map(([course, count]) => ({
    name: course,
    value: count,
    color: COLORS[course] || COLORS.default,
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg border border-slate-700">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-slate-300">
            Students: {payload[0].value}
            <span className="text-slate-400 text-sm ml-1">
              ({((payload[0].value / users.length) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 text-slate-800">User Distribution by Course</h2>
      
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              fill="#8884ff"
              paddingAngle={2}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="transition-opacity duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span className="text-slate-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 text-center">
          <p className="text-slate-600 text-sm">
            Total Users: {users.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CoursePieChart;