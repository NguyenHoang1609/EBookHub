import React, { useState, useEffect } from 'react';
import './UserProfile.scss';
import Navigation from '../component/Navigation';
import Footer from '../component/Footer';
import UserAccount from './components/UserAccount';
import SelfBook from './components/SelfBook';
import MarkedPages from './components/MarkedPages';
import MyOrder from './components/MyOrder';
import Achivements from './components/Achivements';
import PaymentHistory from './components/PaymentHistory';
import Support from './components/Support';

function UserProfile() {
    const [activeSection, setActiveSection] = useState('account');
    const [user, setUser] = useState(null);
    console.log('user', user);
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const getDefaultAvatar = () => {
        return 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.avatar/0/0/38/19886/10182067.jpg?v=11&w=200&h=200';
    };

    const navigationItems = [
        { id: 'account', label: 'Quản lý tài khoản', icon: '👤', active: true },
        { id: 'library', label: 'Sách yêu thích', icon: '📚', active: false },
        { id: 'marked', label: 'Trang đã đánh dấu', icon: '🔖', active: false },
        { id: 'history', label: 'Lịch sử giao dịch', icon: '💳', active: false },
    ];

    const renderMainContent = () => {
        switch (activeSection) {
            case 'account':
                return <UserAccount user={user} setUser={setUser} />;
            case 'library':
                return <SelfBook />;
            case 'marked':
                return <MarkedPages />;
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
                                    <img
                                        src={user.avatar ? `${'http://localhost:8080/public'}${user.avatar}` : getDefaultAvatar()}
                                        alt="User Avatar"
                                        className="avatar-image"
                                    />
                                    <h3 className="username">{user.name}</h3>

                                </div>
                                <div className="user-stats">

                                    {
                                        user.isVip ? (
                                            <div className="action-buttons">
                                                <button className="membership-btn active">Hội viên</button>
                                            </div>
                                        ) : (
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => window.location.href = '/payment'}
                                                    className="membership-btn">Trở thành hội viên</button>
                                            </div>
                                        )
                                    }

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
