import React, { useState, useEffect } from 'react';
import './SideBar.scss';

const SideBar = ({ onNavigation, activeSection }) => {
    const [isLightMode, setIsLightMode] = useState(true);
    const [userRole, setUserRole] = useState(null);

    // All navigation items with role restrictions
    const allNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '/Iconly/Bold/Home.svg', roles: [1] }, // Admin only
        { id: 'book', label: 'Book', icon: '/Iconly/Bold/Edit-Square.svg', roles: [1, 2] }, // Admin and Author
        { id: 'media', label: 'Media', icon: '/Iconly/Bold/Image.svg', roles: [1] }, // Admin only
        { id: 'pages', label: 'Pages', icon: '/Iconly/Bold/Document.svg', roles: [1] }, // Admin only
        { id: 'comment', label: 'Comments', icon: '/Iconly/Bold/Chat.svg', badge: 1, roles: [1] }, // Admin only
        { id: 'appearance', label: 'Appearance', icon: '/Iconly/Bold/Category.svg', roles: [1] }, // Admin only
        { id: 'plugins', label: 'Plugins', icon: '/Iconly/Bold/Bag.svg', roles: [1] }, // Admin only
        { id: 'users', label: 'Users', icon: '/Iconly/Bold/3-User.svg', roles: [1] }, // Admin only
        { id: 'settings', label: 'Settings', icon: '/Iconly/Bold/Setting.svg', roles: [1] }, // Admin only
        { id: 'tools', label: 'Tools', icon: '/Iconly/Bold/Filter.svg', roles: [1] }, // Admin only
    ];
    // Filter navigation items based on user role
    const navItems = allNavItems.filter(item => {
        if (!userRole) return false;
        return item.roles.includes(userRole);
    });

    // Check user role from localStorage on component mount
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const role = user.groupId; // groupId corresponds to role (1=Admin, 2=Author, 3=User)
                setUserRole(role);

                // If user role is 3 (regular user), redirect to home page
                if (role === 3) {
                    alert('Access denied. Regular users are not allowed to access the system dashboard.');
                    window.location.href = '/';
                    return;
                }
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                // If userData is corrupted, redirect to home
                window.location.href = '/';
            }
        } else {
            // If no user data, redirect to home
            window.location.href = '/';
        }
    }, []);

    const handleNavClick = (itemId) => {
        if (onNavigation) {
            onNavigation(itemId);
        }
    };

    const handleLightModeToggle = () => {
        setIsLightMode(!isLightMode);
    };

    const handleLogout = () => {
        // Clear all user data from localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');

        // Navigate to home page
        window.location.href = '/';
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
                <div className="nav-link active" onClick={handleLogout}>
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
