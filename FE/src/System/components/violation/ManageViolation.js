import React, { useState, useEffect } from 'react';
import { violationAPI } from '../../../Util/Api';
import Form from './Form';
import './ManageViolation.scss';

const ManageViolation = () => {
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        page: 1,
        limit: 10
    });
    const [selectedViolation, setSelectedViolation] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [stats, setStats] = useState(null);

    const violationTypes = [
        { value: '', label: 'All types' },
        { value: 'copyright', label: 'Copyright infringement' },
        { value: 'plagiarism', label: 'Plagiarism' },
        { value: 'abuse', label: 'Abuse' },
        { value: 'spam', label: 'Spam' },
        { value: 'other', label: 'Other' }
    ];

    const violationStatuses = [
        { value: '', label: 'All statuses' },
        { value: 'open', label: 'Open' },
        { value: 'under_review', label: 'Under review' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'dismissed', label: 'Dismissed' }
    ];

    const ebookStatuses = [
        { value: 'published', label: 'No change' },
        { value: 'blocked', label: 'Blocked' },
        { value: 'pending_review', label: 'Pending review' },
        { value: 'archived', label: 'Archived' }
    ];

    useEffect(() => {
        fetchViolations();
        fetchStats();
    }, [filters]);

    const fetchViolations = async () => {
        try {
            setLoading(true);
            const result = await violationAPI.getAllViolations(filters);

            if (result.success) {
                setViolations(result.data.DT.violations);
                setPagination(result.data.DT.pagination);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An error occurred while loading the report list');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const result = await violationAPI.getViolationStats();
            if (result.success) {
                setStats(result.data.DT);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filter changes
        }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({
            ...prev,
            page
        }));
    };

    const handleEditViolation = (violation) => {
        setSelectedViolation(violation);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedViolation(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            const result = await violationAPI.updateViolationStatus(
                selectedViolation.id,
                formData.status,
                formData.actionTaken
            );

            if (result.success) {
                // Update ebook status if provided
                if (formData.ebookStatus && selectedViolation.ebook) {
                    await violationAPI.updateEbookStatus(
                        selectedViolation.ebook.ebookId,
                        formData.ebookStatus
                    );
                }

                // Refresh the list
                await fetchViolations();
                await fetchStats();
                handleCloseForm();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An error occurred while updating the report');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'open':
                return 'status-open';
            case 'under_review':
                return 'status-review';
            case 'resolved':
                return 'status-resolved';
            case 'dismissed':
                return 'status-dismissed';
            default:
                return 'status-default';
        }
    };

    const getTypeLabel = (type) => {
        const typeObj = violationTypes.find(t => t.value === type);
        return typeObj ? typeObj.label : type;
    };

    const getStatusLabel = (status) => {
        const statusObj = violationStatuses.find(s => s.value === status);
        return statusObj ? statusObj.label : status;
    };

    if (loading && violations.length === 0) {
        return (
            <div className="manage-violation">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading report list...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-violation">
            <div className="page-header">
                <h1>Manage Violation Reports</h1>
                <p>Review and handle user violation reports</p>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon total">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.totalViolations}</h3>
                            <p>Total reports</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon open">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.statusCounts.open}</h3>
                            <p>Pending</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon review">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.statusCounts.under_review}</h3>
                            <p>Under review</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon resolved">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>{stats.statusCounts.resolved}</h3>
                            <p>Resolved</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
                <div className="filters-section">
                <div className="filter-group">
                    <label>Status:</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        {violationStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Violation type:</label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        {violationTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label>Items per page:</label>
                    <select
                        value={filters.limit}
                        onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Violations Table */}
            <div className="violations-table-container">
                <table className="violations-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Book</th>
                            <th>Author</th>
                            <th>Reporter</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {violations.map((violation) => (
                            <tr key={violation.id}>
                                <td>#{violation.id}</td>
                                <td>
                                    <div className="book-info">
                                        {violation.ebook ? (
                                            <>
                                                <div className="book-cover">
                                                    {violation.ebook.coverImage ? (
                                                        <img
                                                            src={`http://localhost:8080/public${violation.ebook.coverImage}`}
                                                            alt={violation.ebook.title}
                                                        />
                                                    ) : (
                                                        <div className="placeholder-cover">No Cover</div>
                                                    )}
                                                </div>
                                                <div className="book-details">
                                                    <h4>{violation.ebook.title}</h4>
                                                    <span className={`ebook-status ${violation.ebook.status}`}>
                                                        {violation.ebook.status}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="no-ebook">No books</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {violation.author?.avatar ? (
                                                <img
                                                    src={`http://localhost:8080/public${violation.author.avatar}`}
                                                    alt={violation.author.name}
                                                />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {violation.author?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="user-details">
                                            <h4>{violation.author?.name || 'Unknown'}</h4>
                                            <p>{violation.author?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {violation.reporter?.avatar ? (
                                                <img
                                                    src={`http://localhost:8080/public${violation.reporter.avatar}`}
                                                    alt={violation.reporter.name}
                                                />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {violation.reporter?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="user-details">
                                            <h4>{violation.reporter?.name || 'Unknown'}</h4>
                                            <p>{violation.reporter?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="violation-type">{getTypeLabel(violation.type)}</span>
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusBadgeClass(violation.status)}`}>
                                        {getStatusLabel(violation.status)}
                                    </span>
                                </td>
                                <td>{formatDate(violation.created_at)}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEditViolation(violation)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Handle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {violations.length === 0 && !loading && (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                            <h3>No reports</h3>
                        <p>There are currently no violation reports matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                    >
                        Previous
                    </button>

                    <div className="pagination-info">
                        Page {pagination.currentPage} / {pagination.totalPages}
                        ({pagination.totalItems} reports)
                    </div>

                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <Form
                    violation={selectedViolation}
                    ebookStatuses={ebookStatuses}
                    violationStatuses={violationStatuses}
                    onSubmit={handleFormSubmit}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default ManageViolation;
