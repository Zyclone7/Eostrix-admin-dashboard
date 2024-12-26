import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function UsersTable({ onUserData }) {
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
        // Pass user data back to the parent Dashboard component
        onUserData(usersWithTime);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token && user.role === 'admin') {
      fetchUsers();
    }
  }, [user, onUserData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h3 className="text-xl font-semibold">Loading users...</h3>
      </div>
    );
  }

  return (
    <div className="p-6">
      <section className="mb-8">
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
      
        {users.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left border-b font-medium text-gray-600">First Name</th>
                  <th className="p-4 text-left border-b font-medium text-gray-600">Last Name</th>
                  <th className="p-4 text-left border-b font-medium text-gray-600">Email</th>
                  <th className="p-4 text-left border-b font-medium text-gray-600">Course</th>
                  <th className="p-4 text-left border-b font-medium text-gray-600">Total Time Spent</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="transition-colors hover:bg-gray-50">
                    <td className="p-4 border-b">{user.firstName}</td>
                    <td className="p-4 border-b">{user.secondName}</td>
                    <td className="p-4 border-b">{user.email}</td>
                    <td className="p-4 border-b">{user.course || 'Unidentified'}</td>
                    <td className="p-4 border-b">{user.totalTimeSpent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No users found</p>
        )}
      </section>
    </div>
  );
}

export default UsersTable;
