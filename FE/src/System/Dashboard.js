import React, { useState } from 'react';
import './Dashboard.scss'
import SideBar from './SideBar';
import ManageUser from './components/user/ManageUser';
import ManageEbook from './components/book/ManageEbook';
import ManageComment from './components/comment/ManageComment';
import ManageType from './components/type/ManageType';
import ManageViolation from './components/violation/ManageViolation';
import ManageModeration from './components/moderation/ManageModeration';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    const handleNavigation = (section) => {
        setActiveSection(section);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'users':
                return <ManageUser />;
            case 'book':
                return <ManageEbook />;
            case 'type':
                return <ManageType />;
            case 'comment':
                return <ManageComment />;
            case 'violation':
                return <ManageViolation />;
            case 'moderation':
                return <ManageModeration />;
            case 'dashboard':
            default:
                return (
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                        <h1>Welcome to Dashboard</h1>
                        <p>Select a section from the sidebar to get started.</p>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <SideBar onNavigation={handleNavigation} activeSection={activeSection} />
            </div>

            <div className="dashboard-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;
