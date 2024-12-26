import axios from 'axios';

const API_URL = 'http://localhost:5001/api/admin/';

// Create user
const createUser = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.post(API_URL, userData, config);

        // No setting of localStorage or automatic login
        return response.data;
    } catch (error) {
        console.error('User creation failed:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'User creation failed';
    }
};

// Login user
const login = async (userData) => {
    try {
        const response = await axios.post(API_URL + 'login', userData);

        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Login failed';
    }
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

// Get all users except admins
const getAllUsersExceptAdmin = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(API_URL + 'all', config);
        return response.data;
    } catch (error) {
        console.error('Fetching users failed:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to fetch users';
    }
};

// Get user by ID
const getUserById = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(`${API_URL}${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Fetching user by ID failed:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to fetch user';
    }
};

// Update user
const updateUser = async (id, userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.put(`${API_URL}${id}`, userData, config);
        return response.data;
    } catch (error) {
        console.error('Updating user failed:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to update user';
    }
};

// Delete user
const deleteUser = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.delete(`${API_URL}${id}`, config);
        return response.data;
    } catch (error) {
        console.error('Deleting user failed:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Failed to delete user';
    }
};

// Export all methods
const authService = {
    createUser,
    login,
    logout,
    getAllUsersExceptAdmin,
    getUserById,
    updateUser,
    deleteUser,
};

export default authService;
