import React, { useState, useEffect } from 'react';
import { commentAPI, authAPI, contentModerationAPI } from '../../../Util/Api';
import './Review.scss';
import { toast } from 'react-toastify';

const Review = ({ ebook }) => {
    const [comments, setComments] = useState([]);
    const [commentStats, setCommentStats] = useState({ totalComments: 0, topLevelComments: 0, replies: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [replyToComment, setReplyToComment] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Check if user is authenticated and get user data
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('userData')); // Assuming email is stored
                const userEmail = userData.email;
                console.log('review', userData)
                if (userEmail) {
                    const result = await authAPI.getProfile({ email: userEmail });
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

    // Fetch comments and stats
    useEffect(() => {
        if (ebook?.ebookId) {
            fetchComments();
            fetchCommentStats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ebook?.ebookId, currentPage]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const result = await commentAPI.getCommentsByEbook(currentUser, ebook.ebookId, {
                page: currentPage,
                limit: 10,
                sortBy: 'created_at',
                order: 'DESC'
            });

            if (result.success) {
                setComments(result.data.DT.comments);
                setPagination(result.data.DT.pagination);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const fetchCommentStats = async () => {
        try {
            const result = await commentAPI.getCommentStats(ebook.ebookId);
            if (result.success) {
                setCommentStats(result.data.DT);
            }
        } catch (err) {
            console.error('Failed to fetch comment stats:', err);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        setSubmitting(true);
        try {
            // Validate comment content before posting
            const validationResult = await contentModerationAPI.validateCommentContent(newComment.trim());

            if (!validationResult.success) {
                toast('Failed to validate comment: ' + validationResult.message);
                return;
            }

            if (!validationResult.data.DT.isValid) {
                toast(validationResult.data.DT.message);
                return;
            }

            const result = await commentAPI.createComment({
                userData: currentUser,
                ebookId: ebook.ebookId,
                content: newComment.trim()
            });
            console.log('create comment', result);
            if (result.success) {
                setNewComment('');
                fetchComments();
                fetchCommentStats();
            } else {
                toast(result.message);
            }
        } catch (error) {
            toast('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitReply = async (commentId) => {
        if (!replyContent.trim() || !currentUser) return;

        setSubmitting(true);
        try {
            // Validate reply content before posting
            const validationResult = await contentModerationAPI.validateCommentContent(replyContent.trim());

            if (!validationResult.success) {
                toast('Failed to validate reply: ' + validationResult.message);
                return;
            }

            if (!validationResult.data.DT.isValid) {
                toast(validationResult.data.DT.message);
                return;
            }

            const result = await commentAPI.createComment({
                userData: currentUser,
                ebookId: ebook.ebookId,
                content: replyContent.trim(),
                parentCommentId: commentId
            });

            if (result.success) {
                setReplyContent('');
                setReplyToComment(null);
                fetchComments();
                fetchCommentStats();
            } else {
                toast(result.message);
            }
        } catch (error) {
            toast('Failed to post reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) return;

        setSubmitting(true);
        try {
            const result = await commentAPI.updateComment(commentId, currentUser.id, editContent.trim());

            if (result.success) {
                setEditingComment(null);
                setEditContent('');
                fetchComments();
            } else {
                toast(result.message);
            }
        } catch (error) {
            toast('Failed to update comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            const result = await commentAPI.deleteComment(commentId, currentUser.id);

            if (result.success) {
                fetchComments();
                fetchCommentStats();
            } else {
                toast(result.message);
            }
        } catch (error) {
            toast('Failed to delete comment');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hour(s) ago`;
        } else if (diffInDays < 7) {
            return `${Math.floor(diffInDays)} day(s) ago`;
        } else {
            return date.toLocaleDateString('en-US');
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

    if (loading && comments.length === 0) {
        return (
            <div className="reviews-section">
                <div className="loading-comments">
                    <p>Loading comments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-section">

            {/* Comment Form */}
            {currentUser ? (
                <form className="comment-form" onSubmit={handleSubmitComment}>
                    <div className="comment-input-container">
                        <div className="commenter-avatar">
                            <img src={getAvatarUrl(currentUser.avatar)} alt="Your avatar" />
                        </div>
                        <div className="comment-input-wrapper">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write your comment..."
                                className="comment-input"
                                rows="3"
                                maxLength="2000"
                            />
                            <div className="comment-actions">
                                <div className="char-count">
                                    {newComment.length}/2000
                                </div>
                                <button
                                    type="submit"
                                    className="submit-comment-btn"
                                    disabled={!newComment.trim() || submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Post comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="login-prompt">
                    <p>Please sign in to comment</p>
                </div>
            )}

            {/* Comments List */}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {/* Summary for comment counts */}
            <div className="comments-summary">
                <span>{commentStats.totalComments || 0} comments</span>
            </div>

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="review-item">
                        <div className="reviewer-info">
                            <div className="reviewer-avatar">
                                <img src={getAvatarUrl(comment.user?.avatar)} alt="User" />
                            </div>
                            <div className="reviewer-details">
                                <span className="reviewer-name">
                                    {maskUserName(comment.user?.name)}
                                </span>
                                <span className="review-date">
                                    {formatDate(comment.created_at)}
                                </span>
                            </div>
                            {currentUser && currentUser.id === comment.userId && (
                                <div className="comment-actions-menu">
                                    <button
                                        onClick={() => {
                                            setEditingComment(comment.id);
                                            setEditContent(comment.content);
                                        }}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="review-content">
                            {editingComment === comment.id ? (
                                <div className="edit-comment-form">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="edit-comment-input"
                                        rows="3"
                                        maxLength="2000"
                                    />
                                    <div className="edit-actions">
                                        <button
                                            onClick={() => handleEditComment(comment.id)}
                                            className="save-edit-btn"
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingComment(null);
                                                setEditContent('');
                                            }}
                                            className="cancel-edit-btn"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p>{comment.content}</p>
                                    {currentUser && (
                                        <div className="comment-interactions">
                                            <button
                                                onClick={() => setReplyToComment(comment.id)}
                                                className="reply-btn"
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Reply Form */}
                        {replyToComment === comment.id && (
                            <div className="reply-form">
                                <div className="reply-input-container">
                                    <div className="commenter-avatar">
                                        <img src={getAvatarUrl(currentUser?.avatar)} alt="Your avatar" />
                                    </div>
                                    <div className="reply-input-wrapper">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write your reply..."
                                            className="reply-input"
                                            rows="2"
                                            maxLength="2000"
                                        />
                                        <div className="reply-actions">
                                            <button
                                                onClick={() => handleSubmitReply(comment.id)}
                                                className="submit-reply-btn"
                                                disabled={!replyContent.trim() || submitting}
                                            >
                                                {submitting ? 'Submitting...' : 'Reply'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setReplyToComment(null);
                                                    setReplyContent('');
                                                }}
                                                className="cancel-reply-btn"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="replies-container">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="review-reply">
                                        <div className="reply-avatar">
                                            <img src={getAvatarUrl(reply.user?.avatar)} alt="User" />
                                        </div>
                                        <div className="reply-details">
                                            <div className="reply-header">
                                                <span className="reply-name">
                                                    {maskUserName(reply.user?.name)}
                                                </span>
                                                <span className="reply-date">
                                                    {formatDate(reply.created_at)}
                                                </span>
                                                {currentUser && currentUser.id === reply.userId && (
                                                    <div className="reply-actions-menu">
                                                        <button
                                                            onClick={() => {
                                                                setEditingComment(reply.id);
                                                                setEditContent(reply.content);
                                                            }}
                                                            className="edit-btn"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(reply.id)}
                                                            className="delete-btn"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="reply-content">
                                                {editingComment === reply.id ? (
                                                    <div className="edit-comment-form">
                                                        <textarea
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="edit-comment-input"
                                                            rows="2"
                                                            maxLength="2000"
                                                        />
                                                        <div className="edit-actions">
                                                            <button
                                                                onClick={() => handleEditComment(reply.id)}
                                                                className="save-edit-btn"
                                                                disabled={submitting}
                                                            >
                                                                {submitting ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingComment(null);
                                                                    setEditContent('');
                                                                }}
                                                                className="cancel-edit-btn"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p>{reply.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="comments-pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!pagination.hasPrev}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={!pagination.hasNext}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            {comments.length === 0 && !loading && (
                <div className="no-comments">
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            )}
        </div>
    );
};

export default Review;

