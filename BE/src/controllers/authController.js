import authService from '../serivces/authService';


const register = async (req, res) => {
    try {
        console.log('Register request received:', req.body);

        const { name, email, phone, address, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Missing required fields: name, email, and password are required!'
            });
        }

        const result = await authService.registerUser({
            name,
            email,
            phone,
            address,
            password
        });

        if (result.EC === 0) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Register controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during registration'
        });
    }
};


const login = async (req, res) => {
    try {
        console.log('Login request received:', req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Missing required fields: email and password are required!'
            });
        }

        const result = await authService.loginUser(email, password);

        if (result.EC === 0) {
            res.cookie('user', result.DT.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                DT: result.DT.data,
                EC: 0,
                EM: 'Login successful!'
            });
        } else {
            return res.status(401).json(result);
        }

    } catch (error) {
        console.log('Login controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during login'
        });
    }
};


const logout = async (req, res) => {
    try {
        console.log('Logout request received');

        res.clearCookie('user', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            DT: '',
            EC: 0,
            EM: 'Logout successful!'
        });

    } catch (error) {
        console.log('Logout controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during logout'
        });
    }
};


const checkAccount = async (req, res) => {
    try {
        console.log('Check account request received for user:', req.user?.email);

        if (!req.user) {
            return res.status(401).json({
                DT: '',
                EC: -1,
                EM: 'User not authenticated!'
            });
        }

        const result = true;

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }

    } catch (error) {
        console.log('Get profile controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching profile'
        });
    }
};

export default {
    register,
    login,
    logout,
    checkAccount
};
