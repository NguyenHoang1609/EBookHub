import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SelfBook.scss';
import { wishlistAPI } from '../../../Util/Api';

function SelfBook() {
    const [user, setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const u = JSON.parse(userData);
            setUser(u);
            fetchData(u.id);
        }
    }, []);

    const fetchData = async (userId) => {
        setLoading(true);
        const wishRes = await wishlistAPI.list(userId);
        setWishlist(wishRes.success && Array.isArray(wishRes.data) ? wishRes.data : []);
        setLoading(false);
    };

    const handleBookClick = (bookId) => {
        // Navigate to book detail page
        navigate(`/book/${bookId}`);
    };

    if (!user) {
        return (
            <div className="self-book-container">
                    <div className="section-header">
                        <h2>Personal Library</h2>
                        <p>Manage the books you've purchased and own</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">📚</div>
                    <h3>Please sign in to view your library</h3>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="self-book-container">
                <div className="section-header">
                    <h2>Personal Library</h2>
                    <p>Manage the books you've purchased and own</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">📚</div>
                    <h3>Loading data...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="self-book-container">
                <div className="section-header">
                <h2>Favorite Books</h2>
                <p>Manage the books you've marked as favorites</p>
            </div>
            {wishlist.length === 0 ? (
                <div className="placeholder-content">
                    <div className="placeholder-icon">📚</div>
                    <h3>No favorite books yet</h3>
                    <p>Add books to your favorites to manage them!</p>
                </div>
            ) : (
                <div className="book-list">
                    {wishlist.map(item => (
                        <div
                            className="book-item"
                            key={item.ebookId || item.ebook?.ebookId}
                            onClick={() => handleBookClick(item.ebookId || item.ebook?.ebookId)}
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
                            <div className="book-info">
                                <h4>{item.ebook?.title}</h4>
                                <div className="click-hint">
                                    👆 Click to view book details
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SelfBook;
