import React, { useState, useEffect } from 'react';
import { ebookAPI, typeAPI } from '../../Util/Api';
import { useNavigate } from 'react-router-dom';
import './MoreEbook.scss';
import Navbar from './Navigation';
import Footer from './Footer';
const MoreEbook = () => {
    const [ebooks, setEbooks] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTypes();
        fetchEbooks();
    }, [currentPage, selectedType, searchTerm]);

    const fetchTypes = async () => {
        try {
            const result = await typeAPI.getAllTypes();
            if (result.success) {
                setTypes(result.data.DT.types);
            }
        } catch (err) {
            console.error('Failed to fetch types:', err);
        }
    };

    const fetchEbooks = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
                limit: 12,
                status: 'published'
            };

            if (selectedType) {
                params.typeId = selectedType;
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const result = await ebookAPI.getAllEbooks(params);

            if (result.success) {
                const data = result.data.DT;
                setEbooks(data.ebooks);
                setPagination(data.pagination);
            } else {
                setError(result.message);
                setEbooks([]);
            }
        } catch (err) {
            setError('Failed to fetch ebooks');
            setEbooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderBookItem = (ebook, index) => {
        const coverImage = ebook.coverImage || "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510";
        const bookTitle = ebook.title || "Untitled";

        return (
            <div
                key={ebook.ebookId || index}
                onClick={() => {
                    navigate(`/book/${ebook.ebookId}`);
                }}
                className="book-item"
            >
                <div className="book-content">
                    <div className="book-image-container">
                        <div className="book-image-wrapper">
                            <img className="book-image" src={`http://localhost:8080/public${coverImage}`} alt={bookTitle} />
                        </div>
                        <div className="book-overlay" />
                    </div>
                    <div className="book-title">
                        <div className="title-text title-15-50">{bookTitle}</div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading && ebooks.length === 0) {
        return (
            <div className="more-ebook-container">
                <div className="loading-message">Loading ebooks...</div>
            </div>
        );
    }

    return (
        <div className="more-ebook-container">
            <Navbar />
            <div className="more-ebook-header">
                <div className="header-content">
                    <h1 className="header-title">Tất cả sách</h1>
                </div>

                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sách..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>

                    <div className="type-filter">
                        <select
                            value={selectedType}
                            onChange={handleTypeChange}
                            className="type-select"
                        >
                            <option value="">Tất cả thể loại</option>
                            {types.length > 0 && types.map((type) => (
                                <option key={type.typeId} value={type.typeId}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            <div className="books-grid-container">
                {ebooks.length > 0 ? (
                    <div className="books-grid">
                        {ebooks.map((ebook, index) => renderBookItem(ebook, index))}
                    </div>
                ) : (
                    <div className="no-ebooks-message">
                        Không tìm thấy sách nào
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination-container">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn prev"
                    >
                        Trang trước
                    </button>

                    <div className="pagination-info">
                        <span>
                            Trang {pagination.currentPage} / {pagination.totalPages}
                        </span>
                        <span className="total-items">
                            ({pagination.totalItems} sách)
                        </span>
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="pagination-btn next"
                    >
                        Trang sau
                    </button>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MoreEbook;
