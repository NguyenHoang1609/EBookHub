import React, { useState } from 'react';
import './SideBar.scss';

const SideBar = ({ onNavigation, activeSection }) => {
    const [isLightMode, setIsLightMode] = useState(true);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '/Iconly/Bold/Home.svg' },
        { id: 'book', label: 'Book', icon: '/Iconly/Bold/Edit-Square.svg' },
        { id: 'media', label: 'Media', icon: '/Iconly/Bold/Image.svg' },
        { id: 'pages', label: 'Pages', icon: '/Iconly/Bold/Document.svg' },
        { id: 'comments', label: 'Comments', icon: '/Iconly/Bold/Chat.svg', badge: 1 },
        { id: 'appearance', label: 'Appearance', icon: '/Iconly/Bold/Category.svg' },
        { id: 'plugins', label: 'Plugins', icon: '/Iconly/Bold/Bag.svg' },
        { id: 'users', label: 'Users', icon: '/Iconly/Bold/3-User.svg' },
        { id: 'settings', label: 'Settings', icon: '/Iconly/Bold/Setting.svg' },
        { id: 'tools', label: 'Tools', icon: '/Iconly/Bold/Filter.svg' },
    ];

    const handleNavClick = (itemId) => {
        if (onNavigation) {
            onNavigation(itemId);
        }
    };

    const handleLightModeToggle = () => {
        setIsLightMode(!isLightMode);
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-top">
                <div className="logo-section">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <img src="/Union.svg" alt="Logo" className="logo-image" />
                        </div>
                    </div>
                </div>
                <div className="nav-menu">
                    {navItems.map((item) => (
                        <div
                            key={item.id}
                            className={`nav-link ${activeSection === item.id ? 'active' : ''} ${item.badge ? 'with-badge' : ''}`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            <div className="nav-content">
                                <div className="icon-wrapper">
                                    <div className="icon">
                                        <img src={item.icon} alt={item.label} className="icon-image" />
                                    </div>
                                </div>
                                <div className="text-wrapper">
                                    <div className="nav-text">{item.label}</div>
                                </div>
                            </div>
                            {item.badge && (
                                <div className="badge-container">
                                    <div className="badge">
                                        <div className="badge-text">{item.badge}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="sidebar-bottom">

                <div className="nav-link active">
                    <div className="nav-content">
                        <div className="icon-wrapper">
                            <div className="icon">
                                <img src="/Iconly/Bold/Logout.svg" alt="Logout" className="icon-image" />
                            </div>
                        </div>
                        <div className="text-wrapper">
                            <div className="nav-text">Logout</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
