import React, { useState, useEffect } from 'react';
import './RatingModal.scss';
import { toast } from 'react-toastify';

const RatingModal = ({ isOpen, onClose, ebook, user, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens
            setRating(5);
            setReviewText('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
            if (!user) {
            toast('You need to log in to submit a review');
            return;
        }

        setSubmitting(true);
        try {
            const result = await fetch('http://localhost:8080/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    ebookId: ebook.ebookId,
                    rating: rating,
                    reviewText: reviewText.trim() || null
                })
            });

            const response = await result.json();

            if (response.success) {
                toast.success('Your review has been submitted successfully!');
                onClose();
                if (onSubmit) {
                    onSubmit();
                }
            } else {
                toast('An error occurred: ' + response.message);
            }
        } catch (error) {
            toast('An error occurred while submitting the review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStarClick = (starRating) => {
        setRating(starRating);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= rating ? 'filled' : 'empty'}`}
                    onClick={() => handleStarClick(i)}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    if (!isOpen) return null;

    return (
        <div className="rating-modal-overlay" onClick={onClose}>
            <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Rating and Review</h3>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="rating-form">
                    <div className="rating-section">
                        <label className="rating-label">Rating</label>
                        <div className="stars-container">
                            {renderStars()}
                        </div>
                    </div>

                    <div className="review-section">
                        <label className="review-label">Review</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Please leave your review and feedback"
                            className="review-textarea"
                            rows="4"
                            maxLength="300"
                        />
                        <div className="char-count">
                            {reviewText.length}/300
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
