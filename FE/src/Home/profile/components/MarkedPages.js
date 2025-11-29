import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savedPageAPI, ebookAPI } from '../../../Util/Api';
import './MarkedPages.scss';

function MarkedPages() {
    const [user, setUser] = useState(null);
    const [markedPages, setMarkedPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const u = JSON.parse(userData);
            setUser(u);
            fetchMarkedPages(u.id);
        }
    }, []);

    const fetchMarkedPages = async (userId) => {
        setLoading(true);
        try {
            const res = await savedPageAPI.list(userId);
            if (res.success && Array.isArray(res.data)) {
                // Fetch ebook details for each marked page
                const pagesWithBooks = await Promise.all(
                    res.data.map(async (page) => {
                        try {
                            const bookRes = await ebookAPI.getEbookById(page.bookId);
                            return {
                                ...page,
                                ebook: bookRes.success ? bookRes.data.DT : null
                            };
                        } catch (error) {
                            console.error('Error fetching book details:', error);
                            return { ...page, ebook: null };
                        }
                    })
                );
                setMarkedPages(pagesWithBooks);
            } else {
                setMarkedPages([]);
            }
        } catch (error) {
            console.error('Error fetching marked pages:', error);
            setMarkedPages([]);
        }
        setLoading(false);
    };

    const handleBookClick = (bookId, pageNumber) => {
        // Navigate to reader with page parameter
        navigate(`/reader/${bookId}?page=${pageNumber}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    if (!user) {
        return (
            <div className="marked-pages-container">
                <div className="section-header">
                    <h2>Bookmarked Pages</h2>
                    <p>Manage the pages you saved to read later</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">🔖</div>
                    <h3>Please sign in to view bookmarked pages</h3>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="marked-pages-container">
                <div className="section-header">
                    <h2>Bookmarked Pages</h2>
                    <p>Manage the pages you saved to read later</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">🔖</div>
                    <h3>Loading data...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="marked-pages-container">
            <div className="section-header">
                <h2>Bookmarked Pages</h2>
                <p>Manage the pages you saved to read later</p>
            </div>
            {markedPages.length === 0 ? (
                <div className="placeholder-content">
                    <div className="placeholder-icon">🔖</div>
                    <h3>No bookmarked pages yet</h3>
                        <p>Save pages while reading so you can return later!</p>
                </div>
            ) : (
                <div className="marked-pages-list">
                    {markedPages.map(item => (
                        <div
                            className="marked-page-item"
                            key={`${item.bookId}-${item.pageNumber}`}
                            onClick={() => handleBookClick(item.bookId, item.pageNumber)}
                        >
                            <div className="book-cover">
                                {item.ebook?.coverImage ? (
                                    <img
                                        src={`http://localhost:8080/public${item.ebook.coverImage}`}
                                        alt={item.ebook.title}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="placeholder-cover" style={{ display: item.ebook?.coverImage ? 'none' : 'flex' }}>
                                    No Cover
                                </div>
                            </div>
                            <div className="page-info">
                                <h4>{item.ebook?.title || 'Unknown Book'}</h4>
                                <div className="page-details">
                                    <span className="page-number">Page {item.pageNumber}</span>
                                    {item.savedAt && (
                                        <span className="saved-date">
                                            Saved at: {formatDate(item.savedAt)}
                                        </span>
                                    )}
                                </div>
                                <div className="click-hint">
                                    👆 Click to continue reading from this page
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MarkedPages;


