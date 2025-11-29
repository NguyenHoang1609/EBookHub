import React, { useState, useEffect } from 'react';
import './Form.scss';

const Form = ({ violation, ebookStatuses, violationStatuses, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        status: '',
        actionTaken: '',
        ebookStatus: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (violation) {
            setFormData({
                status: violation.status || '',
                actionTaken: violation.actionTaken || '',
                ebookStatus: violation.ebook?.status || ''
            });
        }
    }, [violation]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.status) {
            setError('Please select an action status');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSubmit(formData);
        } catch (err) {
            setError('An error occurred while updating the report');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
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

    const getStatusLabel = (status) => {
        const statusObj = violationStatuses.find(s => s.value === status);
        return statusObj ? statusObj.label : status;
    };

    const getEbookStatusLabel = (status) => {
        const statusObj = ebookStatuses.find(s => s.value === status);
        return statusObj ? statusObj.label : status;
    };
    console.log('ebookStatuses', ebookStatuses);

    return (
        <div className="violation-form">
            <div className="form-overlay" onClick={handleClose}>
                <div className="form-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="form-header">
                        <h2>Handle Violation Report</h2>
                        <button
                            className="close-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="form-content">
                        {/* Violation Details */}
                        <div className="violation-details">
                            <h3>Report details</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <label>Report ID:</label>
                                    <span>#{violation?.id}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Violation type:</label>
                                    <span className="violation-type">{violation?.type}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Current status:</label>
                                    <span className={`status-badge ${violation?.status}`}>
                                        {getStatusLabel(violation?.status)}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Created at:</label>
                                    <span>{formatDate(violation?.created_at)}</span>
                                </div>
                            </div>

                            {/* Book Information */}
                            {violation?.ebook && (
                                <div className="book-section">
                                    <h4>Book information</h4>
                                    <div className="book-info">
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
                                            <h5>{violation.ebook.title}</h5>
                                            <p className="book-id">ID: {violation.ebook.ebookId}</p>
                                            <span className={`ebook-status ${violation.ebook.status}`}>
                                                {getEbookStatusLabel(violation.ebook.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Author Information */}
                            {violation?.author && (
                                <div className="author-section">
                                    <h4>Author information</h4>
                                    <div className="author-info">
                                        <div className="author-avatar">
                                            {violation.author.avatar ? (
                                                <img
                                                    src={`http://localhost:8080/public${violation.author.avatar}`}
                                                    alt={violation.author.name}
                                                />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {violation.author.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="author-details">
                                            <h5>{violation.author.name}</h5>
                                            <p>{violation.author.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reporter Information */}
                            {violation?.reporter && (
                                <div className="reporter-section">
                                    <h4>Reporter information</h4>
                                    <div className="reporter-info">
                                        <div className="reporter-avatar">
                                            {violation.reporter.avatar ? (
                                                <img
                                                    src={`http://localhost:8080/public${violation.reporter.avatar}`}
                                                    alt={violation.reporter.name}
                                                />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {violation.reporter.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="reporter-details">
                                            <h5>{violation.reporter.name}</h5>
                                            <p>{violation.reporter.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reason */}
                            <div className="reason-section">
                                <h4>Reason for report</h4>
                                <div className="reason-content">
                                    <p>{violation?.reason}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Form */}
                        <form onSubmit={handleSubmit} className="action-form">
                            <h3>Action to take</h3>

                            <div className="form-group">
                                <label htmlFor="status">Action status *</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select status</option>
                                    {violationStatuses.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {violation?.ebook && (
                                <div className="form-group">
                                    <label htmlFor="ebookStatus">Book status</label>
                                    <select
                                        id="ebookStatus"
                                        name="ebookStatus"
                                        value={formData.ebookStatus}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="">Select status</option>
                                        {ebookStatuses.map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="form-help">
                                        Change book status if necessary
                                    </small>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="actionTaken">Action notes</label>
                                <textarea
                                    id="actionTaken"
                                    name="actionTaken"
                                    value={formData.actionTaken}
                                    onChange={handleInputChange}
                                    className="form-textarea"
                                    placeholder="Describe the actions taken in detail..."
                                    rows="4"
                                />
                                    <small className="form-help">
                                    Describe in detail the actions taken to handle the report
                                </small>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={loading || !formData.status}
                                >
                                    {loading ? (
                                        <>
                                            <div className="loading-spinner"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Update'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
