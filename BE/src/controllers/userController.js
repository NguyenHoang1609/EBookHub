import userService from '../serivces/userService';

// Get all users with pagination
const getAllUsers = async (req, res) => {
    try {
        console.log('Get all users request received');

        const { page = 0, pageSize = 10, search, groupId, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

        const result = await userService.getAllUsers({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            search,
            groupId: groupId ? parseInt(groupId) : null,
            sortBy,
            sortOrder: sortOrder.toUpperCase()
        });

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Get all users controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching users'
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        console.log('Get user by ID request received:', req.params.id);

        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            });
        }

        const result = await userService.getUserById(parseInt(id));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else if (result.EC === -1) {
            return res.status(404).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Get user by ID controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching user'
        });
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        console.log('Create user request received:', req.body);

        const { name, email, phone, address, password, groupId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Missing required fields: name, email, and password are required!'
            });
        }

        const result = await userService.createUser({
            name,
            email,
            phone,
            address,
            password,
            groupId: groupId ? parseInt(groupId) : 3
        });

        if (result.EC === 0) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Create user controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while creating user'
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        console.log('Update user request received:', req.params.id, req.body);

        const { id } = req.params;
        const { name, email, phone, address, groupId, isActive } = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            });
        }

        const result = await userService.updateUser(parseInt(id), {
            name,
            email,
            phone,
            address,
            groupId: groupId ? parseInt(groupId) : null,
            isActive: isActive !== undefined ? Boolean(isActive) : null
        });

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else if (result.EC === -1) {
            return res.status(404).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Update user controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while updating user'
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        console.log('Delete user request received:', req.params.id);

        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            });
        }

        const result = await userService.deleteUser(parseInt(id));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else if (result.EC === -1) {
            return res.status(404).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Delete user controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while deleting user'
        });
    }
};

// Bulk delete users
const bulkDeleteUsers = async (req, res) => {
    try {
        console.log('Bulk delete users request received:', req.body);

        const { userIds } = req.body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'User IDs array is required and must not be empty!'
            });
        }

        const result = await userService.bulkDeleteUsers(userIds);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Bulk delete users controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while bulk deleting users'
        });
    }
};

// Change user password
const changePassword = async (req, res) => {
    try {
        console.log('Change password request received:', req.params.id);

        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Current password and new password are required!'
            });
        }

        const result = await userService.changePassword(parseInt(id), currentPassword, newPassword);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else if (result.EC === -1) {
            return res.status(404).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Change password controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while changing password'
        });
    }
};

// Get user statistics
const getUserStats = async (req, res) => {
    try {
        console.log('Get user statistics request received');

        const result = await userService.getUserStats();

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Get user statistics controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching user statistics'
        });
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    changePassword,
    getUserStats
};
