import db from '../models';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import JWTservice from '../middleware/JWTservice';

const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log('Password hashing error:', error);
        throw new Error('Failed to hash password');
    }
};

const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.log('Password comparison error:', error);
        throw new Error('Failed to compare password');
    }
};

const checkEmailExists = async (email) => {
    try {
        const user = await db.User.findOne({
            where: { email },
            attributes: ['id']
        });

        if (user && user.id) {
            return true;
        }

        return false;
    } catch (error) {
        console.log('Email check error:', error);
        throw new Error('Failed to check email existence');
    }
};

const checkPhoneExists = async (phone) => {
    try {
        if (!phone) return false;

        const user = await db.User.findOne({
            where: { phone },
            attributes: ['id']
        });
        if (user && user.id) {
            return true;
        }
        return false;

    } catch (error) {
        console.log('Phone check error:', error);
        throw new Error('Failed to check phone existence');
    }
};

const registerUser = async (userData) => {
    try {
        const { name, email, phone, address, password } = userData;

        if (!name || !email || !password) {
            return {
                DT: '',
                EC: -1,
                EM: 'Missing required fields: name, email, and password are required!'
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
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

        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            return {
                DT: '',
                EC: -1,
                EM: 'Email already exists!'
            };
        }

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

        const hashedPassword = await hashPassword(password);

        const newUser = {
            name: name,
            email: email.toLowerCase(),
            phone: phone ? phone : null,
            groupId: 3,
            address: address ? address : null,
            password: hashedPassword
        };

        const createdUser = await db.User.create(newUser);

        console.log('User registered successfully:', createdUser.id);

        return {
            DT: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email
            },
            EC: 0,
            EM: 'User registered successfully!'
        };

    } catch (error) {
        console.log('Registration service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error during registration'
        };
    }
};

const loginUser = async (email, password) => {
    try {
        if (!email || !password) {
            return {
                DT: '',
                EC: -1,
                EM: 'Email and password are required!'
            };
        }

        const user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: email.toLowerCase().trim() },
                    { phone: isNaN(email) ? null : parseInt(email) }
                ]
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
                EM: 'Invalid email or password!'
            };
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid email or password!'
            };
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            avatar: user.avatar,
            groupId: user.groupId || 3,
            group: user.group,
            isVip: user.isVip,
        };

        const tokenData = {
            id: user.id,
            name: user.name,
            email: user.email,
            groupId: user.groupId || 3
        };

        const token = JWTservice.createJwtTokenService(tokenData);

        console.log('User logged in successfully:', user.email);

        return {
            DT: {
                data: userData,
                token: token
            },
            EC: 0,
            EM: 'Login successful!'
        };

    } catch (error) {
        console.log('Login service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error during login'
        };
    }
};

const getUserProfile = async (email) => {
    try {
        if (!email) {
            return {
                DT: '',
                EC: -1,
                EM: 'Email is required!'
            };
        }

        const user = await db.User.findOne({
            where: { email: email.toLowerCase().trim() },
            attributes: ['id', 'name', 'email', 'phone', 'address', 'avatar', 'groupId', 'isVip', 'created_at', 'updated_at'],
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
            DT: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                groupId: user.groupId,
                isVip: user.isVip,
                group: user.group,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            },
            EC: 0,
            EM: 'User profile retrieved successfully!'
        };

    } catch (error) {
        console.log('Get profile service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching profile'
        };
    }
};

const updateUserProfile = async (email, updateData) => {
    try {
        if (!email) {
            return {
                DT: '',
                EC: -1,
                EM: 'Email is required!'
            };
        }

        const { name, phone, address } = updateData;

        const user = await db.User.findOne({
            where: { email: email.toLowerCase().trim() }
        });

        if (!user) {
            return {
                DT: '',
                EC: -1,
                EM: 'User not found!'
            };
        }

        if (phone && phone !== user.phone) {
            const phoneExists = await db.User.findOne({
                where: {
                    phone: parseInt(phone),
                    id: { [Op.ne]: user.id }
                }
            });

            if (phoneExists) {
                return {
                    DT: '',
                    EC: -1,
                    EM: 'Phone number already exists!'
                };
            }
        }

        const updateFields = {};
        if (name) updateFields.name = name.trim();
        if (phone) updateFields.phone = parseInt(phone);
        if (address !== undefined) updateFields.address = address ? address.trim() : null;

        await user.update(updateFields);

        console.log('User profile updated successfully:', user.email);

        return {
            DT: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isVip: user.isVip
            },
            EC: 0,
            EM: 'Profile updated successfully!'
        };

    } catch (error) {
        console.log('Update profile service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while updating profile'
        };
    }
};

export default {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    hashPassword,
    comparePassword,
    checkEmailExists,
    checkPhoneExists
};
