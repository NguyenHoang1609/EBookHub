import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageFlip } from 'page-flip';
import { ebookAPI } from '../../Util/Api';
import Navigation from '../component/Navigation';
import Footer from '../component/Footer';
import './Reader.scss';

const Reader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ebook, setEbook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const pageFlipRef = useRef(null);
    const bookRef = useRef(null);

    useEffect(() => {
        const fetchEbook = async () => {
            try {
                setLoading(true);
                const result = await ebookAPI.getEbookById(id, true);
                if (result.success) {
                    setEbook(result.data.DT);
                    setTotalPages(result.data.DT.pages ? result.data.DT.pages.length : 0);
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

    useEffect(() => {
        if (ebook && ebook.pages && bookRef.current) {
            initializePageFlip();
        }
    }, [ebook]);

    useEffect(() => {
        return () => {
            if (pageFlipRef.current) {
                pageFlipRef.current.destroy();
            }
        };
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (pageFlipRef.current) {
                switch (event.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        event.preventDefault();
                        handlePreviousPage();
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                    case ' ':
                        event.preventDefault();
                        handleNextPage();
                        break;
                    case 'Home':
                        event.preventDefault();
                        pageFlipRef.current.turnToPage(0);
                        break;
                    case 'End':
                        event.preventDefault();
                        const totalPageCount = totalPages + (ebook?.coverImage ? 1 : 0);
                        pageFlipRef.current.turnToPage(totalPageCount - 1);
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [totalPages, ebook]);

    const initializePageFlip = () => {
        if (pageFlipRef.current) {
            pageFlipRef.current.destroy();
        }

        if (bookRef.current) {
            bookRef.current.innerHTML = '';
        }

        const pageFlip = new PageFlip(bookRef.current, {
            width: 400,
            height: 600,
            size: "stretch",
            minWidth: 300,
            maxWidth: 800,
            minHeight: 400,
            maxHeight: 1100,
            maxShadowOpacity: 0.7,
            showCover: true,
            mobileScrollSupport: false,
            usePortrait: true,
            autoSize: true,
            drawShadow: true,
            flippingTime: 800,
            useMouseEvents: true,
            swipeDistance: 30,
            startPage: 0
        });


        const pages = [];


        if (ebook.coverImage) {
            const coverPage = document.createElement('div');
            coverPage.className = 'page cover-page';
            coverPage.setAttribute('data-density', 'hard');
            coverPage.innerHTML = `
                <div class="cover-content">
                    <div class="cover-image">
                        <img src="${process.env.REACT_APP_API_URL || 'http://localhost:8080/public'}${ebook.coverImage}" 
                             alt="${ebook.title}" 
                             onerror="this.style.display='none'" />
                    </div>
                  
                </div>
            `;
            pages.push(coverPage);
        }


        if (ebook.pages && ebook.pages.length > 0) {
            ebook.pages.forEach((page, index) => {
                const contentPage = document.createElement('div');
                contentPage.className = 'page content-page';
                contentPage.innerHTML = `
                    <div class="page-header">
                        <h3>${page.title || `Page ${page.pageNumber}`}</h3>
                    </div>
                    <div class="page-content">
                        ${page.content}
                    </div>
                    <div class="page-footer">
                        <span class="page-number">${page.pageNumber}</span>
                    </div>
                `;
                pages.push(contentPage);
            });
        }


        pageFlip.loadFromHTML(pages);


        pageFlip.on('flip', (e) => {
            setCurrentPage(e.data);
        });

        pageFlip.on('changeState', (e) => {
            console.log('PageFlip state changed:', e.data);
        });

        pageFlipRef.current = pageFlip;
    };

    const handlePreviousPage = () => {
        if (pageFlipRef.current) {
            pageFlipRef.current.flipPrev();
        }
    };

    const handleNextPage = () => {
        if (pageFlipRef.current) {
            pageFlipRef.current.flipNext();
        }
    };

    const handleGoToPage = (pageNumber) => {
        if (pageFlipRef.current) {
            pageFlipRef.current.turnToPage(pageNumber);
        }
    };

    const handleBackToDetail = () => {
        navigate(`/book/${id}`);
    };

    if (loading) {
        return (
            <div className="reader-container">
                <Navigation />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading book...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="reader-container">
                <Navigation />
                <div className="error-container">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={handleBackToDetail} className="back-button">
                        Back to Book Details
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (!ebook || !ebook.pages || ebook.pages.length === 0) {
        return (
            <div className="reader-container">
                <Navigation />
                <div className="error-container">
                    <h2>No Content Available</h2>
                    <p>This book has no pages to display.</p>
                    <button onClick={handleBackToDetail} className="back-button">
                        Back to Book Details
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="reader-container">


            <div className="reader-header">
                <div className="reader-controls">
                    <button onClick={handleBackToDetail} className="back-button">
                        ← Back to Book
                    </button>
                    <div className="book-info">
                        <h2>{ebook.title}</h2>
                    </div>
                </div>
            </div>

            <div className="reader-content">
                <div className="book-container">
                    <div ref={bookRef} className="book" id="book"></div>
                </div>

                <div className="reader-controls-bottom">
                    <div className="page-controls">
                        <button
                            onClick={handlePreviousPage}
                            className="page-button prev-button"
                            disabled={currentPage === 0}
                        >
                            ← Previous
                        </button>

                        <div className="page-info">
                            <span className="current-page">{currentPage + 1}</span>
                            <span className="page-separator">/</span>
                            <span className="total-pages">{totalPages + (ebook.coverImage ? 1 : 0)}</span>
                        </div>

                        <button
                            onClick={handleNextPage}
                            className="page-button next-button"
                            disabled={currentPage >= totalPages + (ebook.coverImage ? 0 : -1)}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Reader;
