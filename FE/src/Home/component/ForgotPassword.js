import React, { useState } from 'react';
import { authAPI } from '../../Util/Api';
import './ForgotPassword.scss';

function ForgotPassword({ onClose }) {
    const [step, setStep] = useState(1); // 1: Verify account, 2: Change password
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        phone: ''
    });
    const [newPasswordData, setNewPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setNewPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
                if (!formData.emailOrPhone || !formData.phone) {
                setError('Please enter all required information');
                setLoading(false);
                return;
            }

            const result = await authAPI.forgotPassword({
                emailOrPhone: formData.emailOrPhone,
                phone: formData.phone
            });

            if (result.success) {
                console.log('Verification successful:', result.data);
                setStep(2); // Move to password change step
            } else {
                setError(result.message || 'Verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
                if (!newPasswordData.newPassword || !newPasswordData.confirmPassword) {
                setError('Please enter all required information');
                setLoading(false);
                return;
            }

                if (newPasswordData.newPassword.length < 6) {
                setError('Password must be at least 6 characters');
                setLoading(false);
                return;
            }

                if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
                setError('Password confirmation does not match');
                setLoading(false);
                return;
            }

            const result = await authAPI.changePassword({
                emailOrPhone: formData.emailOrPhone,
                phone: formData.phone,
                newPassword: newPasswordData.newPassword
            });

            if (result.success) {
                console.log('Password changed successfully:', result.data);
                setError('Password reset successful!');
                // Close modal after 2 seconds to show success message
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError(result.message || 'Password reset failed');
            }
        } catch (error) {
            console.error('Change password error:', error);
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

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-content">
                <div className="forgot-password-form">
                    <button className="close-btn" onClick={onClose}>×</button>

                    <div className="form-header">
                        <h1 className="form-title">
                            {step === 1 ? 'Forgot Password' : 'Reset Password'}
                        </h1>
                        <p className="form-subtitle">
                            {step === 1
                                ? 'Enter account information to verify'
                                : 'Enter your new password'}
                        </p>
                    </div>

                    {error && (
                        <div className={`error-message ${error.includes('successful') ? 'success' : ''}`}>
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form className="forgot-password-form" onSubmit={handleVerify}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Email or phone number"
                                    name="emailOrPhone"
                                    value={formData.emailOrPhone}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Registered phone number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                                style={{
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Verifying...' : 'Verify'}
                            </button>
                        </form>
                    ) : (
                        <form className="forgot-password-form" onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <div className="password-field">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-input"
                                        placeholder="New password"
                                        name="newPassword"
                                        value={newPasswordData.newPassword}
                                        onChange={handlePasswordChange}
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
                            </div>

                            <div className="form-group">
                                <div className="password-field">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-input"
                                        placeholder="Confirm new password"
                                        name="confirmPassword"
                                        value={newPasswordData.confirmPassword}
                                        onChange={handlePasswordChange}
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
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                                style={{
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

