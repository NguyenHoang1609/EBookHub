import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

API.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.data);
        return response;
    },

    
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        if (error.response?.status === 401) {
            console.log('Unauthorized access - redirecting to login');
        }

        return Promise.reject(error);
    }
);

const authAPI = {
    register: async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Registration failed',
                error: error.response?.data || error.message
            };
        }
    },

    login: async (credentials) => {
        try {
            const response = await API.post('/auth/login', credentials);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Login failed',
                error: error.response?.data || error.message
            };
        }
    },

    logout: async () => {
        try {
            const response = await API.post('/auth/logout');
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Logout failed',
                error: error.response?.data || error.message
            };
        }
    },

    getProfile: async () => {
        try {
            const response = await API.get('/auth/profile');
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch profile',
                error: error.response?.data || error.message
            };
        }
    }
};

const apiUtils = {
    isAuthenticated: async () => {
        try {
            const result = await authAPI.getProfile();
            return result.success;
        } catch (error) {
            return false;
        }
    },

    setBaseURL: (url) => {
        API.defaults.baseURL = url;
    },

    getBaseURL: () => {
        return API.defaults.baseURL;
    }
};

export default API;
export { authAPI, apiUtils };
