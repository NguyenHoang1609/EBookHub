import React, { useState } from 'react';
import './Navigation.scss';
import Login from './Login';
import Register from './Register';

function Navigation(props) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleRegisterClick = () => {
        setShowRegisterModal(true);
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
        setShowRegisterModal(false);
    };

    const handleSwitchToRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const handleSwitchToLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    return (
        <div className="navigation-container">
            <div className="navigation-content">
                <div className="left-section">
                    <div className="logo-section">
                        <img className="logo-image" src="https://placehold.co/115x38" />
                        <div className="logo-icon-container">
                            <img className="logo-icon" src="https://placehold.co/33x26" />
                        </div>
                    </div>
                    <div className="navigation-menu">
                        <div className="menu-item ebook">
                            <div className="menu-item-content">
                                <div className="menu-text">Sách điện tử</div>
                            </div>
                        </div>
                        <div className="menu-item member-books">
                            <div className="menu-item-content">
                                <div className="menu-text">Sách hội viên</div>
                            </div>
                        </div>
                        <div className="menu-item school-books">
                            <div className="menu-item-content">
                                <div className="menu-text">Sách hiệu sồi</div>
                            </div>
                        </div>
                        <div className="menu-item audiobooks">
                            <div className="menu-item-content">
                                <div className="menu-text">Sách nói</div>
                            </div>
                        </div>
                        <div className="menu-item comics">
                            <div className="menu-item-content">
                                <div className="menu-text">Truyện tranh</div>
                            </div>
                        </div>
                        <div className="menu-item publishing">
                            <div className="menu-item-content">
                                <div className="menu-text">Dịch vụ Xuất bản</div>
                            </div>
                        </div>
                        <div className="menu-item see-more">
                            <div className="menu-item-content">
                                <div className="menu-text">Xem thêm</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-section">
                    <div className="search-section">
                        <div className="search-container">
                            <div className="search-icon-wrapper">
                                <div className="search-icon">
                                    <div className="search-circle" />
                                    <div className="search-handle" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="subscription-section">
                        <div className="subscription-button">
                            <div className="subscription-icon">
                                <div className="subscription-icon-container">
                                    <div className="subscription-icon-wrapper">
                                        <div className="subscription-icon-svg">
                                            <div className="subscription-main" />
                                            <div className="subscription-dot" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="subscription-text-container">
                                <div className="subscription-text">Gói cước</div>
                            </div>
                        </div>
                    </div>
                    <div className="auth-section">
                        <div className="register-button" onClick={handleRegisterClick}>
                            <div className="register-button-content">
                                <div className="register-text">Đăng ký</div>
                            </div>
                        </div>
                        <div className="login-button" onClick={handleLoginClick}>
                            <div className="login-button-content">
                                <div className="login-text">Đăng nhập</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Overlays */}
            {showLoginModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Login
                            onClose={handleCloseModal}
                            onSwitchToRegister={handleSwitchToRegister}
                        />
                    </div>
                </div>
            )}

            {showRegisterModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Register
                            onClose={handleCloseModal}
                            onSwitchToLogin={handleSwitchToLogin}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navigation;
