import db from '../models';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

const saltRounds = 10;

// Hash password utility
const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.log('Password hashing error:', error);
        throw new Error('Failed to hash password');
    }
};

// Compare password utility
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.log('Password comparison error:', error);
        throw new Error('Failed to compare password');
    }
};

// Check if email exists
const checkEmailExists = async (email, excludeId = null) => {
    try {
        const whereClause = { email: email.toLowerCase().trim() };
        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId };
        }

        const user = await db.User.findOne({
            where: whereClause,
            attributes: ['id']
        });

        return !!user;
    } catch (error) {
        console.log('Email check error:', error);
        throw new Error('Failed to check email existence');
    }
};

// Check if phone exists
const checkPhoneExists = async (phone, excludeId = null) => {
    try {
        if (!phone) return false;

        const whereClause = { phone: parseInt(phone) };
        if (excludeId) {
            whereClause.id = { [Op.ne]: excludeId };
        }

        const user = await db.User.findOne({
            where: whereClause,
            attributes: ['id']
        });

        return !!user;
    } catch (error) {
        console.log('Phone check error:', error);
        throw new Error('Failed to check phone existence');
    }
};

// Validate email format
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Build search conditions
const buildSearchConditions = (search, groupId) => {
    const conditions = {};

    if (search) {
        conditions[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
            { address: { [Op.like]: `%${search}%` } }
        ];
    }

    if (groupId) {
        conditions.groupId = groupId;
    }

    return conditions;
};

// Get all users with pagination and filtering
const getAllUsers = async ({ page = 0, pageSize = 10, search, groupId, sortBy = 'created_at', sortOrder = 'DESC' }) => {
    try {
        const offset = page * pageSize;
        const limit = pageSize;
        const order = [[sortBy, sortOrder]];

        const whereConditions = buildSearchConditions(search, groupId);

        const { count, rows } = await db.User.findAndCountAll({
            where: whereConditions,
            offset,
            limit,
            order,
            distinct: true,
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['id', 'name', 'description'],
                    required: false
                }
            ]
        });

        const totalPages = Math.ceil(count / pageSize);
        const hasNextPage = page < totalPages - 1;
        const hasPrevPage = page > 0;

        return {
            DT: {
                rows: rows,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalItems: count,
                    totalPages,
                    hasNextPage,
                    hasPrevPage
                }
            },
            EC: 0,
            EM: 'Users retrieved successfully!'
        };

    } catch (error) {
        console.log('Get all users service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching users'
        };
    }
};

// Get user by ID
const getUserById = async (id) => {
    try {
        if (!id || isNaN(id)) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            };
        }

        const user = await db.User.findByPk(id, {
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['id', 'name', 'description'],
                    required: false
                }
            ]
        });

        if (!user) {
            return {
                DT: '',
                EC: -1,
                EM: 'User not found!'
            };
        }

        return {
            DT: user,
            EC: 0,
            EM: 'User retrieved successfully!'
        };

    } catch (error) {
        console.log('Get user by ID service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching user'
        };
    }
};

// Create new user
const createUser = async (userData) => {
    try {
        const { name, email, phone, address, password, groupId = 3 } = userData;

        // Validation
        if (!name || !email || !password) {
            return {
                DT: '',
                EC: -1,
                EM: 'Missing required fields: name, email, and password are required!'
            };
        }

        if (!validateEmail(email)) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid email format!'
            };
        }

        if (password.length < 6) {
            return {
                DT: '',
                EC: -1,
                EM: 'Password must be at least 6 characters long!'
            };
        }

        // Check if email exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return {
                DT: '',
                EC: -1,
                EM: 'Email already exists!'
            };
        }

        // Check if phone exists
        if (phone) {
            const phoneExists = await checkPhoneExists(phone);
            if (phoneExists) {
                return {
                    DT: '',
                    EC: -1,
                    EM: 'Phone number already exists!'
                };
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? parseInt(phone) : null,
            address: address ? address.trim() : null,
            password: hashedPassword,
            groupId: parseInt(groupId)
        };

        const createdUser = await db.User.create(newUser);

        // Return user without password
        const userResponse = await db.User.findByPk(createdUser.id, {
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['id', 'name', 'description'],
                    required: false
                }
            ]
        });

        console.log('User created successfully:', createdUser.id);

        return {
            DT: userResponse,
            EC: 0,
            EM: 'User created successfully!'
        };

    } catch (error) {
        console.log('Create user service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while creating user'
        };
    }
};

// Update user
const updateUser = async (id, updateData) => {
    try {
        if (!id || isNaN(id)) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            };
        }

        const { name, email, phone, address, groupId, isActive } = updateData;

        // Find user
        const user = await db.User.findByPk(id);
        if (!user) {
            return {
                DT: '',
                EC: -1,
                EM: 'User not found!'
            };
        }

        // Validate email if provided
        if (email && !validateEmail(email)) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid email format!'
            };
        }

        // Check if email exists (excluding current user)
        if (email) {
            const emailExists = await checkEmailExists(email, id);
            if (emailExists) {
                return {
                    DT: '',
                    EC: -1,
                    EM: 'Email already exists!'
                };
            }
        }

        // Check if phone exists (excluding current user)
        if (phone) {
            const phoneExists = await checkPhoneExists(phone, id);
            if (phoneExists) {
                return {
                    DT: '',
                    EC: -1,
                    EM: 'Phone number already exists!'
                };
            }
        }

        // Prepare update fields
        const updateFields = {};
        if (name) updateFields.name = name.trim();
        if (email) updateFields.email = email.toLowerCase().trim();
        if (phone !== undefined) updateFields.phone = phone ? parseInt(phone) : null;
        if (address !== undefined) updateFields.address = address ? address.trim() : null;
        if (groupId) updateFields.groupId = parseInt(groupId);
        if (isActive !== undefined) updateFields.isActive = Boolean(isActive);

        // Update user
        await user.update(updateFields);

        // Return updated user without password
        const updatedUser = await db.User.findByPk(id, {
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                    model: db.Group,
                    as: 'group',
                    attributes: ['id', 'name', 'description'],
                    required: false
                }
            ]
        });

        console.log('User updated successfully:', id);

        return {
            DT: updatedUser,
            EC: 0,
            EM: 'User updated successfully!'
        };

    } catch (error) {
        console.log('Update user service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while updating user'
        };
    }
};

// Delete user
const deleteUser = async (id) => {
    try {
        if (!id || isNaN(id)) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            };
        }

        const user = await db.User.findByPk(id);
        if (!user) {
            return {
                DT: '',
                EC: -1,
                EM: 'User not found!'
            };
        }

        // Check if user has related data (optional - you can modify this based on your requirements)
        const hasRelatedData = await checkUserRelatedData(id);
        if (hasRelatedData) {
            return {
                DT: '',
                EC: -1,
                EM: 'Cannot delete user with related data. Please remove related records first.'
            };
        }

        await user.destroy();

        console.log('User deleted successfully:', id);

        return {
            DT: '',
            EC: 0,
            EM: 'User deleted successfully!'
        };

    } catch (error) {
        console.log('Delete user service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while deleting user'
        };
    }
};

// Check if user has related data
const checkUserRelatedData = async (userId) => {
    try {
        const [ebooks, reviews, payments, libraryItems, savedPages] = await Promise.all([
            db.Ebook.count({ where: { authorId: userId } }),
            db.ReviewRating.count({ where: { userId } }),
            db.Payment.count({ where: { userId } }),
            db.LibraryWishlist.count({ where: { userId } }),
            db.SavedPage.count({ where: { userId } })
        ]);

        return ebooks > 0 || reviews > 0 || payments > 0 || libraryItems > 0 || savedPages > 0;
    } catch (error) {
        console.log('Check user related data error:', error);
        return false;
    }
};

// Bulk delete users
const bulkDeleteUsers = async (userIds) => {
    try {
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return {
                DT: '',
                EC: -1,
                EM: 'User IDs array is required and must not be empty!'
            };
        }

        // Validate all IDs
        const validIds = userIds.filter(id => !isNaN(parseInt(id)));
        if (validIds.length !== userIds.length) {
            return {
                DT: '',
                EC: -1,
                EM: 'Some user IDs are invalid!'
            };
        }

        // Check if users exist
        const existingUsers = await db.User.findAll({
            where: { id: validIds },
            attributes: ['id']
        });

        if (existingUsers.length !== validIds.length) {
            return {
                DT: '',
                EC: -1,
                EM: 'Some users not found!'
            };
        }

        // Check for related data
        const usersWithRelatedData = [];
        for (const userId of validIds) {
            const hasRelatedData = await checkUserRelatedData(userId);
            if (hasRelatedData) {
                usersWithRelatedData.push(userId);
            }
        }

        if (usersWithRelatedData.length > 0) {
            return {
                DT: '',
                EC: -1,
                EM: `Cannot delete users with IDs: ${usersWithRelatedData.join(', ')}. They have related data.`
            };
        }

        // Delete users
        const deletedCount = await db.User.destroy({
            where: { id: validIds }
        });

        console.log('Bulk delete users completed:', deletedCount);

        return {
            DT: { deletedCount },
            EC: 0,
            EM: `Successfully deleted ${deletedCount} users!`
        };

    } catch (error) {
        console.log('Bulk delete users service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while bulk deleting users'
        };
    }
};

// Change user password
const changePassword = async (id, currentPassword, newPassword) => {
    try {
        if (!id || isNaN(id)) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            };
        }

        if (!currentPassword || !newPassword) {
            return {
                DT: '',
                EC: -1,
                EM: 'Current password and new password are required!'
            };
        }

        if (newPassword.length < 6) {
            return {
                DT: '',
                EC: -1,
                EM: 'New password must be at least 6 characters long!'
            };
        }

        const user = await db.User.findByPk(id);
        if (!user) {
            return {
                DT: '',
                EC: -1,
                EM: 'User not found!'
            };
        }

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return {
                DT: '',
                EC: -1,
                EM: 'Current password is incorrect!'
            };
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword);

        // Update password
        await user.update({ password: hashedNewPassword });

        console.log('Password changed successfully for user:', id);

        return {
            DT: '',
            EC: 0,
            EM: 'Password changed successfully!'
        };

    } catch (error) {
        console.log('Change password service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while changing password'
        };
    }
};

// Get user statistics
const getUserStats = async () => {
    try {
        const [
            totalUsers,
            activeUsers,
            usersByGroup,
            recentUsers,
            monthlyRegistrations
        ] = await Promise.all([
            // Total users
            db.User.count(),

            // Active users
            db.User.count({ where: { isActive: true } }),

            // Users by group
            db.User.findAll({
                attributes: [
                    [db.sequelize.col('User.group_id'), 'groupId'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('User.id')), 'count']
                ],
                include: [
                    {
                        model: db.Group,
                        as: 'group',
                        attributes: ['name'],
                        required: false
                    }
                ],
                group: ['User.group_id', 'group.id', 'group.name'],
                raw: true
            }),

            // Recent users (last 7 days)
            db.User.count({
                where: {
                    created_at: {
                        [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                }
            }),

            // Monthly registrations (last 6 months)
            db.User.findAll({
                attributes: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('created_at'), '%Y-%m'), 'month'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('User.id')), 'count']
                ],
                where: {
                    created_at: {
                        [Op.gte]: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
                    }
                },
                group: [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('created_at'), '%Y-%m')],
                order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('created_at'), '%Y-%m'), 'ASC']],
                raw: true
            })
        ]);

        return {
            DT: {
                totalUsers,
                activeUsers,
                inactiveUsers: totalUsers - activeUsers,
                usersByGroup,
                recentUsers,
                monthlyRegistrations
            },
            EC: 0,
            EM: 'User statistics retrieved successfully!'
        };

    } catch (error) {
        console.log('Get user statistics service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching user statistics'
        };
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
    getUserStats,
    hashPassword,
    comparePassword,
    checkEmailExists,
    checkPhoneExists,
    validateEmail
};
