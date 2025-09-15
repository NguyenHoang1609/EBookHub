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
            const response = await API.get('/auth/account');
            return {
                success: true,
                data: response.data.DT,
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

const userAPI = {
    getAllUsers: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await API.get(url);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch users',
                error: error.response?.data || error.message
            };
        }
    },

    getUserById: async (id) => {
        try {
            const response = await API.get(`/users/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch user',
                error: error.response?.data || error.message
            };
        }
    },

    createUser: async (userData) => {
        try {
            const response = await API.post('/users', userData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to create user',
                error: error.response?.data || error.message
            };
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await API.put(`/users/${id}`, userData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to update user',
                error: error.response?.data || error.message
            };
        }
    },

    updateUserWithAvatar: async (id, formData) => {
        try {
            const response = await API.put(`/users/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to update user',
                error: error.response?.data || error.message
            };
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await API.delete(`/users/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete user',
                error: error.response?.data || error.message
            };
        }
    },

    bulkDeleteUsers: async (userIds) => {
        try {
            const response = await API.delete('/users/bulk', { data: { userIds } });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete users',
                error: error.response?.data || error.message
            };
        }
    },

    changePassword: async (id, currentPassword, newPassword) => {
        try {
            const response = await API.put(`/users/${id}/password`, {
                currentPassword,
                newPassword
            });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to change password',
                error: error.response?.data || error.message
            };
        }
    },

    getUserStats: async () => {
        try {
            const response = await API.get('/users/stats');
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch user statistics',
                error: error.response?.data || error.message
            };
        }
    }
};

const ebookAPI = {
    getAllEbooks: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/ebooks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await API.get(url);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch ebooks',
                error: error.response?.data || error.message
            };
        }
    },

    getEbookById: async (id, includePages = false) => {
        try {
            const url = `/ebooks/${id}${includePages ? '?includePages=true' : ''}`;
            const response = await API.get(url);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch ebook',
                error: error.response?.data || error.message
            };
        }
    },

    createEbook: async (ebookData) => {
        try {
            const response = await API.post('/ebooks', ebookData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to create ebook',
                error: error.response?.data || error.message
            };
        }
    },

    uploadEbook: async (formData) => {
        try {
            const response = await API.post('/ebooks/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000 // 60 seconds for large PDF uploads
            });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to upload ebook',
                error: error.response?.data || error.message
            };
        }
    },

    updateEbook: async (id, ebookData) => {
        try {
            const response = await API.put(`/ebooks/${id}`, ebookData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to update ebook',
                error: error.response?.data || error.message
            };
        }
    },

    deleteEbook: async (id) => {
        try {
            const response = await API.delete(`/ebooks/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete ebook',
                error: error.response?.data || error.message
            };
        }
    },

    getEbookStats: async (authorId = null) => {
        try {
            const url = `/ebooks/stats${authorId ? `?authorId=${authorId}` : ''}`;
            const response = await API.get(url);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch ebook statistics',
                error: error.response?.data || error.message
            };
        }
    },

    getTopBooks: async (limit = 10) => {
        try {
            const url = `/ebooks/top?limit=${limit}`;
            const response = await API.get(url);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch top books',
                error: error.response?.data || error.message
            };
        }
    }
};

const pageAPI = {
    getAllPagesByEbook: async (ebookId, status = 'published') => {
        try {
            const url = `/pages/ebook/${ebookId}${status ? `?status=${status}` : ''}`;
            const response = await API.get(url);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch pages',
                error: error.response?.data || error.message
            };
        }
    },

    getPageById: async (id) => {
        try {
            const response = await API.get(`/pages/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch page',
                error: error.response?.data || error.message
            };
        }
    },

    getPageByNumber: async (ebookId, pageNumber) => {
        try {
            const response = await API.get(`/pages/ebook/${ebookId}/page/${pageNumber}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch page',
                error: error.response?.data || error.message
            };
        }
    },

    createPage: async (pageData) => {
        try {
            const response = await API.post('/pages', pageData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to create page',
                error: error.response?.data || error.message
            };
        }
    },

    updatePage: async (id, pageData) => {
        try {
            const response = await API.put(`/pages/${id}`, pageData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to update page',
                error: error.response?.data || error.message
            };
        }
    },

    deletePage: async (id) => {
        try {
            const response = await API.delete(`/pages/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete page',
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
export { authAPI, userAPI, ebookAPI, pageAPI, apiUtils };
