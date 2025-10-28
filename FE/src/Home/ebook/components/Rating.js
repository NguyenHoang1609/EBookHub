import React, { useState, useEffect } from 'react';
import { authAPI } from '../../../Util/Api';
import './Rating.scss';

const Rating = ({ ebook, onWriteReview }) => {
    const [ratings, setRatings] = useState([]);
    const [ratingStats, setRatingStats] = useState({
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    // Check if user is authenticated and get user data
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData) {
                    const result = await authAPI.getProfile({ email: userData.email });
                    if (result.success) {
                        setCurrentUser(result.data);
                    }
                }
            } catch (error) {
                console.error('Failed to get user profile:', error);
            }
        };
        checkAuth();
    }, []);

    // Fetch ratings
    useEffect(() => {
        if (ebook?.ebookId) {
            fetchRatings();
        }
    }, [ebook?.ebookId, currentPage]);

    const fetchRatings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/ratings/ebook/${ebook.ebookId}?page=${currentPage}&limit=10`);
            const result = await response.json();

            if (result.success) {
                setRatings(result.data.ratings);
                setRatingStats({
                    averageRating: result.data.averageRating,
                    totalRatings: result.data.totalCount,
                    ratingDistribution: result.data.ratingDistribution
                });
                setPagination(result.data.pagination);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch ratings');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInHours < 1) {
            return 'Vừa xong';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} giờ trước`;
        } else if (diffInDays < 7) {
            return `${Math.floor(diffInDays)} ngày trước`;
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    };

    const getAvatarUrl = (avatar) => {
        if (avatar) {
            return `http://localhost:8080/public${avatar}`;
        }
        return "https://placehold.co/42x42";
    };

    const maskUserName = (name) => {
        if (!name || name.length <= 3) return name;
        const firstPart = name.substring(0, 3);
        const masked = '*'.repeat(Math.min(name.length - 3, 6));
        return firstPart + masked;
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const getRatingDistribution = (rating) => {
        const distribution = ratingStats.ratingDistribution.find(d => d.rating === rating);
        return distribution ? distribution.count : 0;
    };

    const getRatingPercentage = (rating) => {
        if (ratingStats.totalRatings === 0) return 0;
        const count = getRatingDistribution(rating);
        return (count / ratingStats.totalRatings) * 100;
    };

    if (loading && ratings.length === 0) {
        return (
            <div className="ratings-section">
                <div className="loading-ratings">
                    <p>Đang tải đánh giá...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ratings-section">
            <h2>Độc giả nói gì về "{ebook?.title}"</h2>

            {/* Rating Summary */}
            <div className="rating-summary">
                <div className="overall-rating">
                    <div className="rating-score">
                        <span className="score">{ratingStats.averageRating.toFixed(1)}</span>
                        <div className="stars">
                            {renderStars(Math.round(ratingStats.averageRating))}
                        </div>
                        <span className="rating-count">{ratingStats.totalRatings} đánh giá</span>
                    </div>
                </div>

                <div className="rating-distribution">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="rating-bar">
                            <span className="rating-label">{rating} sao</span>
                            <div className="bar-container">
                                <div
                                    className="bar-fill"
                                    style={{ width: `${getRatingPercentage(rating)}%` }}
                                ></div>
                            </div>
                            <span className="rating-count">{getRatingDistribution(rating)}</span>
                        </div>
                    ))}
                </div>

                <div className="write-review-section">
                    <button
                        className="write-review-btn"
                        onClick={onWriteReview}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor" />
                        </svg>
                        Viết đánh giá
                    </button>
                </div>
            </div>

            {/* Individual Ratings */}
            <div className="ratings-list">
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {ratings.map((rating) => (
                    <div key={rating.id} className="rating-item">
                        <div className="reviewer-info">
                            <div className="reviewer-avatar">
                                <img src={getAvatarUrl(rating.user?.avatar)} alt="User" />
                            </div>
                            <div className="reviewer-details">
                                <span className="reviewer-name">
                                    {maskUserName(rating.user?.name)}
                                </span>
                                <span className="review-date">
                                    {formatDate(rating.createdAt)}
                                </span>
                            </div>
                            <div className="rating-stars">
                                {renderStars(rating.rating)}
                            </div>
                        </div>

                        {rating.reviewText && (
                            <div className="review-content">
                                <p>{rating.reviewText}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="ratings-pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!pagination.hasPrev}
                        className="pagination-btn"
                    >
                        Trang trước
                    </button>
                    <span className="pagination-info">
                        Trang {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={!pagination.hasNext}
                        className="pagination-btn"
                    >
                        Trang sau
                    </button>
                </div>
            )}

            {ratings.length === 0 && !loading && (
                <div className="no-ratings">
                    <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                </div>
            )}
        </div>
    );
};

export default Rating;
