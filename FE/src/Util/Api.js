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

    getProfile: async (userData) => {
        try {
            console.log('userData api', userData);
            const response = await API.get('/auth/account?email=' + userData.email, {

            });
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
    },

    getFavouriteBooks: async (userId, limit = 10) => {
        try {
            const url = `/ebooks/favourite/${userId}?limit=${limit}`;
            const response = await API.get(url);
            console.log('getFavouriteBooks', response.data);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch favourite books',
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

const commentAPI = {
    getCommentsByEbook: async (currentUser, ebookId, params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/comments/ebook/${ebookId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
                message: error.response?.data?.EM || 'Failed to fetch comments',
                error: error.response?.data || error.message
            };
        }
    },

    getCommentStats: async (ebookId) => {
        try {
            const response = await API.get(`/comments/ebook/${ebookId}/stats`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch comment statistics',
                error: error.response?.data || error.message
            };
        }
    },

    createComment: async (commentData) => {
        try {
            const response = await API.post('/comments', commentData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to create comment',
                error: error.response?.data || error.message
            };
        }
    },

    updateComment: async (commentId, content) => {
        try {
            const response = await API.put(`/comments/${commentId}`, { content });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to update comment',
                error: error.response?.data || error.message
            };
        }
    },

    deleteComment: async (commentId) => {
        try {
            const response = await API.delete(`/comments/${commentId}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete comment',
                error: error.response?.data || error.message
            };
        }
    },

    // Admin-specific comment functions
    getAllComments: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/comments/admin${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
                message: error.response?.data?.EM || 'Failed to fetch all comments',
                error: error.response?.data || error.message
            };
        }
    },

    toggleCommentStatus: async (commentId, isActive) => {
        try {
            const response = await API.put(`/comments/${commentId}/status`, { isActive });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to toggle comment status',
                error: error.response?.data || error.message
            };
        }
    },

    getCommentsByUser: async (userId, params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/comments/user/${userId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
                message: error.response?.data?.EM || 'Failed to fetch user comments',
                error: error.response?.data || error.message
            };
        }
    },

    bulkDeleteComments: async (commentIds) => {
        try {
            const response = await API.delete('/comments/bulk', { data: { commentIds } });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete comments',
                error: error.response?.data || error.message
            };
        }
    },

    getCommentStatistics: async () => {
        try {
            const response = await API.get('/comments/statistics');
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch comment statistics',
                error: error.response?.data || error.message
            };
        }
    }
};

const typeAPI = {
    getAllTypes: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/types${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
                message: error.response?.data?.EM || 'Failed to fetch types',
                error: error.response?.data || error.message
            };
        }
    },

    getTypeById: async (id) => {
        try {
            const response = await API.get(`/types/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch type',
                error: error.response?.data || error.message
            };
        }
    },

    createType: async (typeData) => {
        try {
            const response = await API.post('/types', typeData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to create type',
                error: error.response?.data || error.message
            };
        }
    },

    updateType: async (id, typeData) => {
        try {
            const response = await API.put(`/types/${id}`, typeData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to update type',
                error: error.response?.data || error.message
            };
        }
    },

    deleteType: async (id) => {
        try {
            const response = await API.delete(`/types/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete type',
                error: error.response?.data || error.message
            };
        }
    },

    getUserFavouriteTypes: async (userId) => {
        try {
            const response = await API.get(`/users/${userId}/favourite-types`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch user favourite types',
                error: error.response?.data || error.message
            };
        }
    },

    addUserFavouriteType: async (userId, typeId) => {
        try {
            const response = await API.post(`/users/${userId}/favourite-types`, { typeId });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to add favourite type',
                error: error.response?.data || error.message
            };
        }
    },

    removeUserFavouriteType: async (userId, typeId) => {
        try {
            const response = await API.delete(`/users/${userId}/favourite-types/${typeId}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to remove favourite type',
                error: error.response?.data || error.message
            };
        }
    },

    getEbooksByType: async (typeId, params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/types/${typeId}/ebooks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
                message: error.response?.data?.EM || 'Failed to fetch ebooks by type',
                error: error.response?.data || error.message
            };
        }
    },

    addTypesToEbook: async (ebookId, typeIds) => {
        try {
            const response = await API.post(`/ebooks/${ebookId}/types`, { typeIds });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to add types to ebook',
                error: error.response?.data || error.message
            };
        }
    }
};

const violationAPI = {
    createViolation: async (violationData) => {
        try {
            const response = await API.post('/violations', violationData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to create violation report',
                error: error.response?.data || error.message
            };
        }
    },

    getAllViolations: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/violations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
                message: error.response?.data?.EM || 'Failed to fetch violations',
                error: error.response?.data || error.message
            };
        }
    },

    getViolationById: async (id) => {
        try {
            const response = await API.get(`/violations/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch violation',
                error: error.response?.data || error.message
            };
        }
    },

    updateViolationStatus: async (id, status, actionTaken) => {
        try {
            const response = await API.put(`/violations/${id}/status`, {
                status,
                actionTaken
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
                message: error.response?.data?.EM || 'Failed to update violation status',
                error: error.response?.data || error.message
            };
        }
    },

    deleteViolation: async (id) => {
        try {
            const response = await API.delete(`/violations/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete violation',
                error: error.response?.data || error.message
            };
        }
    },

    getViolationStats: async () => {
        try {
            const response = await API.get('/violations/stats');
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch violation statistics',
                error: error.response?.data || error.message
            };
        }
    },

    updateEbookStatus: async (ebookId, status) => {
        try {
            const response = await API.put(`/ebooks/${ebookId}/status`, { status });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to update ebook status',
                error: error.response?.data || error.message
            };
        }
    }
};

const contentModerationAPI = {
    createModerationWord: async (moderationData) => {
        try {
            const response = await API.post('/moderation/words', moderationData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to create moderation word',
                error: error.response?.data || error.message
            };
        }
    },

    getAllModerationWords: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const url = `/moderation/words${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
                message: error.response?.data?.EM || 'Failed to fetch moderation words',
                error: error.response?.data || error.message
            };
        }
    },

    getModerationWordById: async (id) => {
        try {
            const response = await API.get(`/moderation/words/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch moderation word',
                error: error.response?.data || error.message
            };
        }
    },

    updateModerationWord: async (id, moderationData) => {
        try {
            const response = await API.put(`/moderation/words/${id}`, moderationData);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to update moderation word',
                error: error.response?.data || error.message
            };
        }
    },

    deleteModerationWord: async (id) => {
        try {
            const response = await API.delete(`/moderation/words/${id}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete moderation word',
                error: error.response?.data || error.message
            };
        }
    },

    bulkDeleteModerationWords: async (moderationIds) => {
        try {
            const response = await API.delete('/moderation/words/bulk', { data: { moderationIds } });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to delete moderation words',
                error: error.response?.data || error.message
            };
        }
    },

    getModerationStats: async () => {
        try {
            const response = await API.get('/moderation/words/stats');
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to fetch moderation statistics',
                error: error.response?.data || error.message
            };
        }
    },

    validateContent: async (content) => {
        try {
            const response = await API.post('/moderation/validate', { content });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to validate content',
                error: error.response?.data || error.message
            };
        }
    },

    validateEbookContent: async (ebookId) => {
        try {
            const response = await API.post(`/moderation/validate/ebook/${ebookId}`);
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to validate ebook content',
                error: error.response?.data || error.message
            };
        }
    },

    validateAllEbooks: async () => {
        try {
            const response = await API.post('/moderation/validate/all-ebooks');
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to validate all ebooks',
                error: error.response?.data || error.message
            };
        }
    },

    validateCommentContent: async (content) => {
        try {
            const response = await API.post('/moderation/validate/comment', { content });
            return {
                success: true,
                data: response.data,
                message: response.data.EM
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.EM || 'Failed to validate comment content',
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

const paymentAPI = {
    list: async () => {
        try {
            const response = await API.get('/payments');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to fetch payments', error: error.response?.data || error.message };
        }
    },
    create: async (payload) => {
        try {
            const response = await API.post('/payments', payload);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to create payment', error: error.response?.data || error.message };
        }
    },
    status: async (userId, amount) => {
        try {
            const response = await API.get(`/payments/status?userId=${userId}&amount=${amount}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to check payment status', error: error.response?.data || error.message };
        }
    }
};

const wishlistAPI = {
    add: async (userId, ebookId) => {
        try {
            const response = await API.post('/wishlist', { userId, ebookId });
            return { success: response.data.EC === 0, data: response.data.DT, message: response.data.EM };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to add to wishlist', error: error.response?.data || error.message };
        }
    },
    remove: async (userId, ebookId) => {
        try {
            const response = await API.delete('/wishlist', { data: { userId, ebookId } });
            return { success: response.data.EC === 0, data: response.data.DT, message: response.data.EM };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to remove from wishlist', error: error.response?.data || error.message };
        }
    },
    list: async (userId) => {
        try {
            const response = await API.get(`/wishlist?userId=${userId}`);
            return { success: response.data.EC === 0, data: response.data.DT, message: response.data.EM };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to fetch wishlist', error: error.response?.data || error.message };
        }
    },
    check: async (userId, ebookId) => {
        try {
            const response = await API.get(`/wishlist/check?userId=${userId}&ebookId=${ebookId}`);
            return { success: response.data.EC === 0, data: response.data.DT, message: response.data.EM };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to check wishlist', error: error.response?.data || error.message };
        }
    }
};

const savedPageAPI = {
    saveOrUpdate: async (userId, bookId, pageNumber) => {
        try {
            const response = await API.post('/saved-page', { userId, bookId, pageNumber });
            return { success: response.data.EC === 0, data: response.data.DT, message: response.data.EM };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to save page', error: error.response?.data || error.message };
        }
    },
    remove: async (userId, bookId) => {
        try {
            const response = await API.delete('/saved-page', { data: { userId, bookId } });
            return { success: response.data.EC === 0, data: response.data.DT, message: response.data.EM };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to remove saved page', error: error.response?.data || error.message };
        }
    },
    list: async (userId) => {
        try {
            const response = await API.get(`/saved-page?userId=${userId}`);
            return { success: response.data.EC === 0, data: response.data.DT, message: response.data.EM };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to fetch saved pages', error: error.response?.data || error.message };
        }
    },
    get: async (userId, bookId) => {
        try {
            const response = await API.get(`/saved-page/get?userId=${userId}&bookId=${bookId}`);
            return { success: response.data.EC === 0, data: response.data.DT, message: response.data.EM };
        } catch (error) {
            return { success: false, message: error.response?.data?.EM || 'Failed to fetch saved page', error: error.response?.data || error.message };
        }
    }
};

// Extend paymentAPI for user payment history
paymentAPI.getByUser = async (userId) => {
    try {
        const response = await API.get(`/payments/user?userId=${userId}`);
        return { success: true, data: response.data.data.DT };
    } catch (error) {
        return { success: false, message: error.response?.data?.EM || 'Failed to fetch payment history', error: error.response?.data || error.message };
    }
};

export default API;
export { authAPI, userAPI, ebookAPI, pageAPI, commentAPI, typeAPI, violationAPI, contentModerationAPI, apiUtils, paymentAPI, audioAPI, wishlistAPI, savedPageAPI };
