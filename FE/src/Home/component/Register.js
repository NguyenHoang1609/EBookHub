import React, { useState } from 'react';
import { authAPI } from '../../Util/Api';
import FavouriteTypeForm from './FavouriteTypeForm';
import './Register.scss';
import { toast } from 'react-toastify';

function Register({ onClose, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showFavouriteTypes, setShowFavouriteTypes] = useState(false);
    const [registeredUser, setRegisteredUser] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            setError('Please enter all required information');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Password confirmation does not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Invalid email');
            return false;
        }

        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Invalid phone number (10-11 digits)');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        setError('');

        try {
            if (!validateForm()) {
                setLoading(false);
                return;
            }

            const result = await authAPI.register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            console.log('result', result);

            if (result.success && result.data.EC === 0) {
                console.log('Registration successful:', result.data);

                // Store registered user data for favourite types form
                setRegisteredUser(result.data.DT);

                // Show favourite types form instead of immediate redirect
                setShowFavouriteTypes(true);
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleFavouriteTypesComplete = () => {
        // After user completes favourite types selection, redirect to login
        toast('Registration successful! Please log in.');
        onSwitchToLogin();
    };

    const handleFavouriteTypesSkip = () => {
        // User skipped favourite types selection, redirect to login
        toast('Registration successful! Please log in.');
        onSwitchToLogin();
    };

    // Show favourite types form if registration was successful
    if (showFavouriteTypes && registeredUser) {
        return (
            <FavouriteTypeForm
                userData={registeredUser}
                onComplete={handleFavouriteTypesComplete}
                onSkip={handleFavouriteTypesSkip}
            />
        );
    }

    return (
        <div className="register-container">
            <div className="register-content">
                <div className="register-form">
                    <button className="close-btn" onClick={onClose}>×</button>

                    <div className="form-header">
                        <h1 className="form-title">Create an account</h1>
                        <p className="form-subtitle">Sign up to purchase and track your reading</p>
                    </div>

                    {error && (
                        <div className="error-message" style={{
                            color: '#ff4444',
                            backgroundColor: '#ffebee',
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            textAlign: 'center',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="register-form">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Full name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="Phone number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-field">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    minLength="6"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                    disabled={loading}
                                >
                                    <svg className="icon" viewBox="0 0 24 24">
                                        {showPassword ? (
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L6.06 6.06 7.48 4.64l10.88 10.88-1.42 1.42ZM9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-1.45-1.45A14.5 14.5 0 0 0 21.12 12A14.5 14.5 0 0 0 12 6c-.84 0-1.64.16-2.35.44l-1.9-1.9C8.68 4.19 9.82 4 12 4ZM12 14a2 2 0 1 1-2-2 2 2 0 0 1 2 2Z" />
                                        ) : (
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                            <div className="password-hint">Password must be at least 6 characters</div>
                        </div>

                        <div className="form-group">
                            <div className="password-field">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Confirm password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={toggleConfirmPasswordVisibility}
                                    disabled={loading}
                                >
                                    <svg className="icon" viewBox="0 0 24 24">
                                        {showConfirmPassword ? (
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L6.06 6.06 7.48 4.64l10.88 10.88-1.42 1.42ZM9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-1.45-1.45A14.5 14.5 0 0 0 21.12 12A14.5 14.5 0 0 0 12 6c-.84 0-1.64.16-2.35.44l-1.9-1.9C8.68 4.19 9.82 4 12 4ZM12 14a2 2 0 1 1-2-2 2 2 0 0 1 2 2Z" />
                                        ) : (
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                            <div className="password-hint">Re-enter password to confirm</div>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                            style={{
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            onClick={handleSubmit}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>

                        <div className="policy-link">
                            <a href="/policy">Terms and Conditions</a>
                        </div>
                    </div>

                    {/* <div className="divider">
                        <span className="divider-text">Or sign up with</span>
                    </div>

                    <div className="social-buttons">
                        <button className="social-btn facebook" onClick={() => { }}>
                            <svg className="icon" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                        <button className="social-btn google" onClick={() => { }}>
                            <svg className="icon" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </div> */}

                    {/* <div className="terms-text">
                        By clicking "Register", you agree to Waka's terms and conditions
                    </div> */}

                    <div className="login-link">
                        Already have an account?
                        <button type="button" className="link-button" onClick={onSwitchToLogin}>Log in now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
