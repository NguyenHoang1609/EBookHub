import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { ebookAPI } from '../../Util/Api';
import { wishlistAPI } from '../../Util/Api';
import { readingHistoryAPI } from '../../Util/Api';
import Navigation from '../component/Navigation';
import Footer from '../component/Footer';
import Review from './components/Review';
import Rating from './components/Rating';
import RatingModal from './components/RatingModal';
import ReportModal from './components/ReportModal';
import './EbookDetail.scss';
import Section from '../component/Section';
const EbookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ebook, setEbook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'ratings'
    const [user, setUser] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    console.log('user', user);

    useEffect(() => {
        window.scrollTo(0, 0)
        const userData = localStorage.getItem('userData');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        const fetchEbook = async () => {
            try {
                setLoading(true);
                const result = await ebookAPI.getEbookById(id, true);
                if (result.success) {
                    setEbook(result.data.DT);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Failed to fetch ebook details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEbook();
        }
    }, [id]);

    // Check if book is in wishlist on load
    useEffect(() => {
        if (user && id) {
            wishlistAPI.check(user.id, id).then(res => {
                setIsFavourite(!!res.data);
            });
        }
    }, [user, id]);

    const handleToggleFavourite = async () => {
        if (!user) {
            toast('You need to log in to use this feature.');
            return;
        }
        setFavLoading(true);
        if (isFavourite) {
            const res = await wishlistAPI.remove(user.id, id);
            if (res.success) {
                setIsFavourite(false);
            }

        } else {
            const res = await wishlistAPI.add(user.id, id);
            if (res.success) {
                setIsFavourite(true);
            }

        }
        setFavLoading(false);
    };

    // star rendering helper removed (not used)

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    const handleReadBook = async () => {
        if (ebook?.isVipEbook && !user?.is_vip) {
            toast('This book is for VIP accounts only. Please upgrade to read it.');
            navigate('/payment');
            return;
        }
        if (user) {
            try {
                await readingHistoryAPI.record(user.id, id);
            } catch (err) {
                // non-blocking
            }
        }
        navigate(`/reader/${id}`);
    };

    const handleReportViolation = () => {
        setShowReportModal(true);
    };

    const handleWriteReview = () => {
        if (!user) {
            toast('You need to log in to rate this book');
            return;
        }
        setShowRatingModal(true);
    };

    const handleRatingSubmitted = () => {
        setRefreshKey(prev => prev + 1);
        setShowRatingModal(false);
    };

    const handleShare = async () => {
        const currentUrl = window.location.href;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(currentUrl);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = currentUrl;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            toast.success('Link copied');
        } catch (err) {
            toast.error('Unable to copy link');
        }
    };

    if (loading) {
        return (
            <div className="ebook-detail-page">
                <Navigation />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading book details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="ebook-detail-page">
                <Navigation />
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!ebook) {
        return (
            <div className="ebook-detail-page">
                <Navigation />
                <div className="not-found-container">
                    <h2>Book not found</h2>
                    <p>The book you're looking for doesn't exist.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="ebook-detail-page">
            <Navigation />

            <div className="ebook-detail-container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <span>Home</span>
                    <span className="chevron">›</span>
                    <span>{ebook.title}</span>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {/* Left Sidebar - Book Cover */}
                    <div className="book-cover-section">
                        <div className="book-cover-container">
                            <div className="book-cover">
                                {ebook.coverImage ? (
                                    <img src={`http://localhost:8080/public${ebook.coverImage}`} alt={ebook.title} />
                                ) : (
                                    <div className="placeholder-cover">
                                        <span>No Cover</span>
                                    </div>
                                )}
                            </div>
                            {/* <div className="member-badge">
                                <span>VIP</span>
                                <div className="member-icon">
                                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
                                        <path d="M17.5 0C7.84 0 0 7.84 0 17.5S7.84 35 17.5 35 35 27.16 35 17.5 27.16 0 17.5 0Z" fill="#FFD700" />
                                    </svg>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Center Content - Book Details */}
                    <div className="book-details-section">
                        <div className="book-header">
                            <h1 className="book-title">{ebook.title}</h1>
                            <div className="rating-section">
                                {/* <div className="rating">
                                    <span className="rating-value">3.8</span>
                                    <div className="stars">
                                        {renderStars(3.8)}
                                    </div>
                                    <span className="rating-count">13 reviews</span>
                                </div> */}
                            </div>
                            {/* <div className="trending-badge">
                                <span className="trending-number">#1</span>
                                <span className="trending-text">in top trending eBooks</span>
                                <div className="trending-arrow">→</div>
                            </div> */}
                        </div>

                        <div className="book-info-grid">
                            <div className="info-item">
                                <span className="info-label">Author</span>
                                <span className="info-value">{ebook.customAuthor || ebook.author?.name || 'Unknown'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Genres</span>
                                <div className='type-list'>
                                    {ebook?.types.map(type => {
                                        return <span>{type.name}, </span>

                                    })}
                                </div>

                            </div>
                            <div className="info-item">
                                <span className="info-label">Publisher</span>
                                <span className="info-value">People's Army Publishing House</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Subscription</span>
                                {ebook.isVipEbook ? (
                                    <span className="info-value">VIP</span>
                                ) : (
                                    <span className="info-value">Regular</span>
                                )}

                            </div>
                            <div className="info-item">
                                <span className="info-label">Published</span>
                                <span className="info-value">{formatDate(ebook.createdAt)}</span>
                            </div>
                        </div>

                        {/* Book Type Selection */}
                        {/* <div className="selection-section">
                            <span className="selection-label">Select book type</span>
                            <div className="selection-buttons">
                                <button
                                    className={`selection-btn ${bookType === 'Ebook' ? 'active' : ''}`}
                                    onClick={() => setBookType('Ebook')}
                                >
                                    Ebook
                                </button>
                                <button
                                    className={`selection-btn ${bookType === 'Audiobook' ? 'active' : ''}`}
                                    onClick={() => setBookType('Audiobook')}
                                >
                                    Audiobook
                                </button>
                                <button
                                    className={`selection-btn ${bookType === 'Paperback' ? 'active' : ''}`}
                                    onClick={() => setBookType('Paperback')}
                                >
                                    Paperback
                                </button>
                            </div>
                        </div> */}

                        {/* Content Type Selection */}
                        {/* <div className="selection-section">
                            <span className="selection-label">Select content type</span>
                            <div className="selection-buttons">
                                <button
                                    className={`selection-btn ${contentType === 'Full' ? 'active' : ''}`}
                                    onClick={() => setContentType('Full')}
                                >
                                    Full
                                </button>
                                <button
                                    className={`selection-btn ${contentType === 'Summary' ? 'active' : ''}`}
                                    onClick={() => setContentType('Summary')}
                                >
                                    Summary
                                </button>
                            </div>
                        </div> */}

                        {/* Book Description */}
                        <div className="book-description">

                            {showFullDescription ? (
                                <>
                                    <p>{ebook.description}</p>
                                </>
                            ) : (
                                <p>{ebook.description.substring(0, 100)}<span className="read-more" onClick={() => setShowFullDescription(true)}>...</span></p>
                            )}
                            {showFullDescription && (
                                    <button className="read-more-btn" onClick={() => setShowFullDescription(false)}>
                                    Show less
                                </button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="read-book-btn" onClick={handleReadBook}>
                                <span>Read Book</span>
                            </button>
                            <button className={`action-btn heart-btn${isFavourite ? ' active' : ''}`} onClick={handleToggleFavourite} disabled={favLoading} title={isFavourite ? 'Remove from favorites' : 'Add to favorites'}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill={isFavourite ? '#ff4d4f' : 'white'} />
                                </svg>
                            </button>
                            <button className="action-btn share-btn" onClick={handleShare} title="Copy link">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="white" />
                                </svg>
                            </button>
                            <button className="action-btn report-btn" onClick={handleReportViolation}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar - Member Offer */}
                    {/* <div className="member-offer-section">
                        <div className="offer-container">
                            <div className="offer-header">
                                <h3>VIP OFFERS</h3>
                            </div>
                            <div className="offer-content">
                                <div className="offer-title">
                                    <span>WAKA 12 MONTHS</span>
                                    <span className="offer-price">329,000 VND</span>
                                </div>
                                <div className="offer-description">
                                    <p>Get 2 extra months when purchasing the 12-month plan</p>
                                    <p>for 14 months</p>
                                </div>
                                <div className="countdown-timer">
                                        <span>Only</span>
                                    <div className="timer-display">
                                        <div className="timer-box">
                                            <span>42</span>
                                        </div>
                                        <span>Hours</span>
                                        <div className="timer-separator">:</div>
                                        <div className="timer-box">
                                            <span>33</span>
                                        </div>
                                        <span>Minutes</span>
                                        <div className="timer-separator">:</div>
                                        <div className="timer-box">
                                            <span>54</span>
                                        </div>
                                        <span>Seconds</span>
                                    </div>
                                </div>
                                <button className="buy-package-btn">BUY NOW</button>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Reviews Section */}
                <div className="reviews-section-detail">
                    <div className="reviews-header">
                        <h2>What readers say about "{ebook?.title}"</h2>
                        <div className="reviews-tabs">
                            <button
                                className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
                                onClick={() => setActiveTab('comments')}
                                >
                                Comments
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'ratings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ratings')}
                                >
                                Ratings & Reviews
                            </button>
                        </div>
                    </div>

                    {activeTab === 'comments' && <Review ebook={ebook} />}
                    {activeTab === 'ratings' && (
                        <Rating
                            ebook={ebook}
                            onWriteReview={handleWriteReview}
                            refreshKey={refreshKey}
                        />
                    )}
                </div>


                {/* Related Books Sections */}

                <div className="related-books-section">

                    <Section
                        title="New Releases"
                        apiType="getAllEbooks"
                        apiParams={{
                            page: 1,
                            limit: 10,
                            status: 'published'
                        }}
                        showRanking={false}
                        showMemberBadge={true} />
                </div>

                {/* Partner Section */}
                <div className="partner-section">
                    <h2>Partners</h2>
                    <div className="partner-banner">
                        <img src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3508.jpg?v=8&w=1920&h=600" alt="Partner Banner" />
                    </div>
                </div>
            </div>

            <Footer />

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                ebook={ebook}
                user={user}
                author={ebook?.author}
            />

            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                ebook={ebook}
                user={user}
                onSubmit={handleRatingSubmitted}
            />
        </div>
    );
};

export default EbookDetail;
