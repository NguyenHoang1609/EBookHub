import React, { useEffect, useState } from 'react';
import './SelfBook.scss';
import { wishlistAPI, savedPageAPI } from '../../../Util/Api';

function SelfBook() {
    const [user, setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);

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
        const [wishRes, progRes] = await Promise.all([
            wishlistAPI.list(userId),
            savedPageAPI.list(userId)
        ]);
        setWishlist(wishRes.success && Array.isArray(wishRes.data) ? wishRes.data : []);
        setProgress(progRes.success && Array.isArray(progRes.data) ? progRes.data : []);
        setLoading(false);
    };

    const getProgressForBook = (ebookId) => {
        const item = progress.find(p => p.bookId === ebookId);
        return item ? item.pageNumber : null;
    };

    if (!user) {
        return (
            <div className="self-book-container">
                <div className="section-header">
                    <h2>Tủ sách cá nhân</h2>
                    <p>Quản lý các cuốn sách bạn đã mua và sở hữu</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">📚</div>
                    <h3>Vui lòng đăng nhập để xem tủ sách cá nhân</h3>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="self-book-container">
                <div className="section-header">
                    <h2>Tủ sách cá nhân</h2>
                    <p>Quản lý các cuốn sách bạn đã mua và sở hữu</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">📚</div>
                    <h3>Đang tải dữ liệu...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="self-book-container">
            <div className="section-header">
                <h2>Tủ sách cá nhân</h2>
                <p>Quản lý các cuốn sách bạn đã đánh dấu yêu thích và tiến độ đọc</p>
            </div>
            {wishlist.length === 0 ? (
                <div className="placeholder-content">
                    <div className="placeholder-icon">📚</div>
                    <h3>Chưa có sách yêu thích nào</h3>
                    <p>Hãy thêm sách vào tủ yêu thích để quản lý và theo dõi tiến độ đọc!</p>
                </div>
            ) : (
                <div className="book-list">
                    {wishlist.map(item => (
                        <div className="book-item" key={item.ebookId || item.ebook?.ebookId}>
                            <div className="book-cover">
                                {item.ebook?.coverImage ? (
                                    <img src={`http://localhost:8080/public${item.ebook.coverImage}`} alt={item.ebook.title} />
                                ) : (
                                    <div className="placeholder-cover">No Cover</div>
                                )}
                            </div>
                            <div className="book-info">
                                <h4>{item.ebook?.title}</h4>
                                <div className="progress-info">
                                    {getProgressForBook(item.ebookId || item.ebook?.ebookId) ? (
                                        <span>Tiến độ: Trang {getProgressForBook(item.ebookId || item.ebook?.ebookId)}</span>
                                    ) : (
                                        <span>Chưa lưu tiến độ</span>
                                    )}
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
