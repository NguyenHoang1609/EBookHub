import React, { useState, useRef } from 'react';
import './UserAccount.scss';
import { userAPI } from '../../../Util/Api';

function UserAccount({ user, setUser }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        avatar: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedGender, setSelectedGender] = useState('Khác');
    const [birthday, setBirthday] = useState('01/01/1900');
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const fileInputRef = useRef(null);

    const getDefaultAvatar = () => {
        return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setMessage('Vui lòng chọn file ảnh!');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setMessage('File ảnh không được vượt quá 5MB!');
                return;
            }

            setFormData(prev => ({
                ...prev,
                avatar: file
            }));

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('address', formData.address);

            if (formData.avatar) {
                submitData.append('avatar', formData.avatar);
            }

            const result = await userAPI.updateUserWithAvatar(user.id, submitData);

            if (result.success) {
                setMessage('Cập nhật thông tin thành công!');

                const updatedUser = { ...user, ...result.data.DT };
                setUser(updatedUser);
                localStorage.setItem('userData', JSON.stringify(updatedUser));

                if (formData.avatar) {
                    setPreviewAvatar(null);
                    setFormData(prev => ({ ...prev, avatar: null }));
                }
            } else {
                setMessage(result.message || 'Có lỗi xảy ra khi cập nhật!');
            }
        } catch (error) {
            console.error('Update error:', error);
            setMessage('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
            avatar: null
        });
        setPreviewAvatar(null);
        setMessage('');
    };

    return (
        <div className="user-account-container">
            <div className="account-header">
                <div className="tab-navigation">
                    <div className="tab active">Thông tin cá nhân</div>
                    <div className="tab">Địa chỉ</div>
                    <div className="tab">Tài khoản và bảo mật</div>
                    <div className="tab">Tài khoản liên kết</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="account-form">
                <div className="form-section">
                    <div className="form-fields">
                        <div className="form-group readonly">
                            <label>Tên đăng nhập</label>
                            <div className="input-display">
                                {user?.name || 'N/A'}
                            </div>
                        </div>

                        <div className="form-group readonly">
                            <label>ID người dùng</label>
                            <div className="input-display">
                                {user?.id || 'N/A'}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Nhập email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Ngày sinh</label>
                                <div className="date-input">
                                    <input
                                        type="text"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                        placeholder="dd/mm/yyyy"
                                    />
                                    <span className="date-icon">📅</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Giới tính</label>
                                <div className="select-input">
                                    <select
                                        value={selectedGender}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                    <span className="select-arrow">▼</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                        </div>

                        {message && (
                            <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="avatar-section">
                        <div className="avatar-display">
                            <img
                                src={`${'http://localhost:8080/public'}${previewAvatar || user?.avatar || getDefaultAvatar()}`}
                                alt="User Avatar"
                                className="avatar-image"
                            />
                        </div>
                        <button
                            type="button"
                            className="change-avatar-btn"
                            onClick={handleAvatarClick}
                            disabled={isLoading}
                        >
                            Thay ảnh
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UserAccount;
