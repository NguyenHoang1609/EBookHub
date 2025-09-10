import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ebookAPI } from '../../Util/Api';
import './Section.scss';
import { useNavigate } from 'react-router-dom';
function Section(props) {
    const {
        title = "Waka đề xuất",
        apiType = "getTopBooks",
        apiParams = {},
        showRanking = true,
        showMemberBadge = true
    } = props;

    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        fetchEbooks();
    }, [apiType, apiParams]);

    console.log(ebooks);

    const fetchEbooks = async () => {
        setLoading(true);
        setError('');

        try {
            let result;

            switch (apiType) {
                case 'getAllEbooks':
                    result = await ebookAPI.getAllEbooks(apiParams);
                    break;
                case 'getTopBooks':
                    result = await ebookAPI.getTopBooks(apiParams.limit || 10);
                    break;
                default:
                    result = await ebookAPI.getTopBooks(10);
            }

            if (result.success) {
                const data = result.data.DT;
                // Handle different response structures
                if (data.ebooks) {
                    setEbooks(data.ebooks);
                } else if (Array.isArray(data)) {
                    setEbooks(data);
                } else {
                    setEbooks([]);
                }
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

    const renderBookItem = (ebook, index) => {
        const coverImage = ebook.coverImage || "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510";
        const bookTitle = ebook.title || "Untitled";
        const rankNumber = index + 1;

        return (
            <SwiperSlide key={ebook.ebookId || index}>
                <div
                    onClick={() => {
                        navigate(`/book/${ebook.ebookId}`);
                    }}
                    className="book-item">
                    <div className="book-content">
                        <div className="book-image-container">
                            <div className="book-image-wrapper">
                                <img className="book-image" src={`http://localhost:8080/public${coverImage}`} alt={bookTitle} />
                            </div>
                            <div className="book-overlay" />
                            {showMemberBadge && (
                                <div className="member-badge">
                                    <div className="badge-content">
                                        <div className="badge-text">Hội viên</div>
                                    </div>
                                </div>
                            )}
                            {showRanking && (
                                <>
                                    <div className={`rank-overlay ${rankNumber <= 3 ? `rank-${rankNumber}` : 'rank-other'}`} />
                                    <div className={`rank-number ${rankNumber === 10 ? 'rank-10' : 'rank-single'}`}>
                                        <div className="rank-text">{rankNumber}</div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="book-title">
                            <div className="title-text title-15-50">{bookTitle}</div>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        );
    };

    if (loading) {
        return (
            <div className="section-container">
                <div className="section-content">
                    <div className="section-header">
                        <div className="header-content">
                            <div className="section-title">{title}</div>
                        </div>
                    </div>
                    <div className="loading-message">Loading ebooks...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="section-container">
                <div className="section-content">
                    <div className="section-header">
                        <div className="header-content">
                            <div className="section-title">{title}</div>
                        </div>
                    </div>
                    <div className="error-message">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="section-container">
            <div className="section-content">
                <div className="section-header">
                    <div className="header-content">
                        <div className="section-title">{title}</div>
                    </div>
                </div>

                <div className="section-tabs">
                    <div className="tab-item active">
                        <div className="tab-content">
                            <div className="tab-text">Đọc nhiều</div>
                        </div>
                    </div>
                    <div className="tab-item inactive">
                        <div className="tab-content">
                            <div className="tab-text">Nghe nhiều</div>
                        </div>
                    </div>
                    <div className="tab-item inactive">
                        <div className="tab-content">
                            <div className="tab-text">Sách Hiệu Sồi</div>
                        </div>
                    </div>
                    <div className="tab-item inactive">
                        <div className="tab-content">
                            <div className="tab-text">Podcast</div>
                        </div>
                    </div>
                    <div className="tab-item inactive community">
                        <div className="tab-content">
                            <div className="tab-text">Cộng đồng viết</div>
                        </div>
                    </div>
                </div>

                <div className="books-grid-container">
                    {ebooks.length > 0 ? (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={5}
                            navigation={{
                                nextEl: '.section-swiper-button-next',
                                prevEl: '.section-swiper-button-prev',
                            }}
                            pagination={{
                                el: '.section-swiper-pagination',
                                clickable: true,
                            }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                                480: {
                                    slidesPerView: 3,
                                    spaceBetween: 15,
                                },
                                768: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                            }}
                            className="books-swiper"
                        >
                            {ebooks.map((ebook, index) => renderBookItem(ebook, index))}
                        </Swiper>
                    ) : (
                        <div className="no-books-message">No ebooks available</div>
                    )}

                    {/* Custom Navigation */}
                    <div className="section-swiper-button-prev">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="section-swiper-button-next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Custom Pagination */}
                    <div className="section-swiper-pagination"></div>
                </div>
            </div>
        </div>
    );
}

export default Section;