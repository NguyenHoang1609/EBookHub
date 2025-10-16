import React, { useState, useEffect } from 'react';
import './Dashboard.scss'
import SideBar from './SideBar';
import ManageUser from './components/user/ManageUser';
import ManageEbook from './components/book/ManageEbook';
import ManageComment from './components/comment/ManageComment';
import ManageType from './components/type/ManageType';
import ManageViolation from './components/violation/ManageViolation';
import ManageModeration from './components/moderation/ManageModeration';
import { userAPI, ebookAPI } from '../Util/Api';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                const user = JSON.parse(storedUserData);
                setUserData(user);
                setUserRole(user.groupId);
                loadDashboardStats(user.groupId, user.id);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const loadDashboardStats = async (role, userId) => {
        try {
            setLoading(true);
            let stats = null;

            if (role === 1) {
                // Admin - get system-wide statistics
                const [userStats, ebookStats] = await Promise.all([
                    userAPI.getDashboardStats(),
                    ebookAPI.getDashboardStats()
                ]);

                if (userStats.success && ebookStats.success) {
                    stats = {
                        userStats: userStats.data.DT,
                        ebookStats: ebookStats.data.DT
                    };
                }
            } else if (role === 2) {
                // Author - get author-specific statistics
                const ebookStats = await ebookAPI.getDashboardStats(userId);
                if (ebookStats.success) {
                    stats = {
                        ebookStats: ebookStats.data.DT
                    };
                }
            }

            setDashboardStats(stats);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = (section) => {
        setActiveSection(section);
    };

    const renderDashboardContent = () => {
        if (loading) {
            return (
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            );
        }

        if (!dashboardStats) {
            return (
                <div className="dashboard-error">
                    <h2>Unable to load dashboard data</h2>
                    <p>Please try refreshing the page.</p>
                </div>
            );
        }

        if (userRole === 1) {
            // Admin Dashboard
            return (
                <div className="admin-dashboard">
                    {/* <div className="dashboard-header">
                        <h1>Admin Dashboard</h1>
                        <p>System Overview & Statistics</p>
                    </div> */}

                    <div className="stats-grid">
                        {/* User Statistics */}
                        <div className="stats-section">
                            <h2>User Statistics</h2>
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon users-icon">👥</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.userStats?.totalUsers || 0}</h3>
                                        <p>Total Users</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon active-icon">✅</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.userStats?.activeUsers || 0}</h3>
                                        <p>Active Users</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon vip-icon">⭐</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.userStats?.vipUsers || 0}</h3>
                                        <p>VIP Users</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon authors-icon">✍️</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.userStats?.authors || 0}</h3>
                                        <p>Authors</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ebook Statistics */}
                        <div className="stats-section">
                            <h2>Ebook Statistics</h2>
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon books-icon">📚</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.totalEbooks || 0}</h3>
                                        <p>Total Ebooks</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon published-icon">📖</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.publishedEbooks || 0}</h3>
                                        <p>Published</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon draft-icon">📝</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.draftEbooks || 0}</h3>
                                        <p>Drafts</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon views-icon">👁️</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.totalViews || 0}</h3>
                                        <p>Total Views</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Statistics */}
                        <div className="stats-section">
                            <h2>System Statistics</h2>
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon comments-icon">💬</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.userStats?.totalComments || 0}</h3>
                                        <p>Total Comments</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon payments-icon">💳</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.userStats?.totalPayments || 0}</h3>
                                        <p>Total Payments</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon recent-icon">🆕</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.userStats?.recentUsers || 0}</h3>
                                        <p>New Users (7 days)</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon pages-icon">📄</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.totalPages || 0}</h3>
                                        <p>Total Pages</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (userRole === 2) {
            // Author Dashboard
            return (
                <div className="author-dashboard">


                    <div className="stats-grid">
                        {/* Author Ebook Statistics */}
                        <div className="stats-section">
                            <h2>Your Ebook Statistics</h2>
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon books-icon">📚</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.totalEbooks || 0}</h3>
                                        <p>Total Ebooks</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon published-icon">📖</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.publishedEbooks || 0}</h3>
                                        <p>Published</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon draft-icon">📝</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.draftEbooks || 0}</h3>
                                        <p>Drafts</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon pending-icon">⏳</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.pendingReviewEbooks || 0}</h3>
                                        <p>Pending Review</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Statistics */}
                        <div className="stats-section">
                            <h2>Performance Metrics</h2>
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon views-icon">👁️</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.totalViews || 0}</h3>
                                        <p>Total Views</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon avg-views-icon">📊</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.averageViews || 0}</h3>
                                        <p>Avg Views/Book</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon vip-icon">⭐</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.vipEbooks || 0}</h3>
                                        <p>VIP Ebooks</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon recent-icon">🆕</div>
                                    <div className="stat-content">
                                        <h3>{dashboardStats.ebookStats?.recentEbooks || 0}</h3>
                                        <p>New (7 days)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Performing Books */}
                        {dashboardStats.ebookStats?.topEbooks && dashboardStats.ebookStats.topEbooks.length > 0 && (
                            <div className="stats-section">
                                <h2>Top Performing Books</h2>
                                <div className="top-books-list">
                                    {dashboardStats.ebookStats.topEbooks.map((book, index) => (
                                        <div key={book.ebookId} className="top-book-item">
                                            <div className="book-rank">#{index + 1}</div>
                                            <div className="book-info">
                                                <h4>{book.title}</h4>
                                                <p>{book.viewCount} views • {book.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="dashboard-error">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this dashboard.</p>
            </div>
        );
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
                return renderDashboardContent();
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
