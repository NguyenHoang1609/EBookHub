import React, { useState, useEffect } from 'react';
import './UserProfile.scss';
import Navigation from '../component/Navigation';
import Footer from '../component/Footer';
import UserAccount from './components/UserAccount';
import SelfBook from './components/SelfBook';
import MyOrder from './components/MyOrder';
import Achivements from './components/Achivements';
import PaymentHistory from './components/PaymentHistory';
import Support from './components/Support';

function UserProfile() {
    const [activeSection, setActiveSection] = useState('account');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const getDefaultAvatar = () => {
        return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80';
    };

    const navigationItems = [
        { id: 'account', label: 'Quản lý tài khoản', icon: '👤', active: true },
        { id: 'library', label: 'Tủ sách cá nhân', icon: '📚', active: false },
        { id: 'orders', label: 'Quản lý đơn hàng', icon: '📋', active: false, hasDropdown: true },
        { id: 'achievements', label: 'Thành tích', icon: '🏆', active: false },
        { id: 'history', label: 'Lịch sử giao dịch', icon: '💳', active: false },
        { id: 'support', label: 'Hỗ trợ khách hàng', icon: '📞', active: false }
    ];

    const renderMainContent = () => {
        switch (activeSection) {
            case 'account':
                return <UserAccount user={user} setUser={setUser} />;
            case 'library':
                return <SelfBook />;
            case 'orders':
                return <MyOrder />;
            case 'achievements':
                return <Achivements />;
            case 'history':
                return <PaymentHistory />;
            case 'support':
                return <Support />;
            default:
                return <UserAccount user={user} setUser={setUser} />;
        }
    };

    if (!user) {
        return (
            <div className="user-profile-loading">
                <Navigation />
                <div className="loading-content">
                    <p>Đang tải thông tin người dùng...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="user-profile-page">
            <Navigation />

            <div className="profile-container">
                <div className="profile-content">
                    <div className="sidebar">
                        <div className="user-info-section">
                            <div className="user-info">

                                <div className="user-avatar">
                                    <h3 className="username">{user.name}</h3>
                                    <img
                                        src={`${'http://localhost:8080/public'}${user.avatar || getDefaultAvatar()}`}
                                        alt="User Avatar"
                                        className="avatar-image"
                                    />
                                </div>
                                <div className="user-stats">
                                    <p className="stats-text">1,500 Sồi có hạn đến ngày 31/10/2025</p>
                                    <div className="currency-stats">
                                        <div className="currency-item">
                                            <span className="currency-icon soi">🌰</span>
                                            <span className="currency-value soi">1,500</span>
                                        </div>
                                        <div className="currency-item">
                                            <span className="currency-icon la">🍃</span>
                                            <span className="currency-value la">0</span>
                                        </div>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="recharge-btn">Nạp sồi</button>
                                        <button className="membership-btn">Trở thành hội viên</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="navigation-menu">
                            {navigationItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveSection(item.id)}
                                >
                                    <span className="menu-icon">{item.icon}</span>
                                    <span className="menu-label">{item.label}</span>
                                    {item.hasDropdown && <span className="dropdown-icon">▼</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="main-content">
                        <div className="content-header">
                            <h1>Quản lý thông tin</h1>
                        </div>

                        <div className="content-body">
                            {renderMainContent()}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default UserProfile;
