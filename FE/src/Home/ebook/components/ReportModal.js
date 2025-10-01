import React, { useState } from 'react';
import { violationAPI } from '../../../Util/Api';
import './ReportModal.scss';

const ReportModal = ({ isOpen, onClose, ebook, author, user }) => {
    const [formData, setFormData] = useState({
        type: 'other',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const violationTypes = [
        { value: 'copyright', label: 'Vi phạm bản quyền' },
        { value: 'plagiarism', label: 'Đạo văn' },
        { value: 'abuse', label: 'Lạm dụng' },
        { value: 'spam', label: 'Spam' },
        { value: 'other', label: 'Khác' }
    ];

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

        if (!formData.reason.trim()) {
            setError('Vui lòng nhập lý do báo cáo');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const violationData = {
                authorId: author?.id,
                ebookId: ebook?.ebookId,
                reportedBy: user?.id,
                type: formData.type,
                reason: formData.reason.trim()
            };

            const result = await violationAPI.createViolation(violationData);

            if (result.success) {
                setSuccess(true);
                // Reset form
                setFormData({
                    type: 'other',
                    reason: ''
                });
                // Close modal after 2 seconds
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 2000);
            } else {
                setError(result.message || 'Có lỗi xảy ra khi gửi báo cáo');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi gửi báo cáo');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                type: 'other',
                reason: ''
            });
            setError('');
            setSuccess(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="report-modal-overlay" onClick={handleClose}>
            <div className="report-modal" onClick={(e) => e.stopPropagation()}>
                <div className="report-modal-header">
                    <h2>Báo cáo vi phạm</h2>
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

                <div className="report-modal-content">
                    {success ? (
                        <div className="success-message">
                            <div className="success-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Báo cáo đã được gửi thành công!</h3>
                            <p>Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.</p>
                        </div>
                    ) : (
                        <>
                            <div className="report-info">
                                <div className="book-info">
                                    <h3>Thông tin sách</h3>
                                    <p><strong>Tên sách:</strong> {ebook?.title}</p>
                                    <p><strong>Tác giả:</strong> {author?.name}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="report-form">
                                <div className="form-group">
                                    <label htmlFor="type">Loại vi phạm *</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        {violationTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reason">Lý do báo cáo *</label>
                                    <textarea
                                        id="reason"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        className="form-textarea"
                                        placeholder="Vui lòng mô tả chi tiết về vi phạm..."
                                        rows="4"
                                        required
                                    />
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
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={loading || !formData.reason.trim()}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="loading-spinner"></div>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi báo cáo'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
