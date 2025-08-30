import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Section.scss';

function Section(props) {




    return (
        <div className="section-container color1">
            <div className="section-content">
                <div className="section-header">
                    <div className="header-content">
                        <div className="section-title">Waka đề xuất</div>
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
                <div>test</div>

                <div className="books-grid-container">
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
                        {/* Book 1 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Mưa đỏ" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>

                                                {/* <div className="badge-icon-container">
                                                    <div className="badge-icon-wrapper">
                                                        <div className="badge-icon">
                                                            <div className="icon-background" />
                                                            <img className="icon-foreground" src="/icon-member.svg" />
                                                        </div>
                                                    </div>
                                                </div> */}

                                            </div>

                                        </div>
                                        <div className="rank-overlay rank-1" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">1</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-50">Mưa đỏ</div>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>

                        {/* Book 2 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Siêu cấp cưng chiều" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-2" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">2</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-38">Siêu cấp cưng chiều</div>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>

                        {/* Book 3 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Cô vợ nhỏ của ngài Phó" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-3" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">3</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-50">Cô vợ nhỏ của ngài Phó</div>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>

                        {/* Book 4 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Bảo bối của ngài Tống" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-other" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">4</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-62">Bảo bối của ngài Tống</div>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>

                        {/* Book 5 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Cưng chiều cô vợ quân nhân" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-other" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">5</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-38">Cưng chiều cô vợ quân nhân</div>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>

                        {/* Book 6 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Lấy chàng kỹ sư" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-other" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">6</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-38">Lấy chàng kỹ sư</div>
                                    </div>
                                </div>
                            </div>

                        </SwiperSlide>

                        {/* Book 7 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Trăng trên đỉnh núi" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-other" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">7</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-50">Trăng trên đỉnh núi</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* Book 8 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Vợ yêu là đại lão" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-other" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">8</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-38">Vợ yêu là đại lão</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* Book 9 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Thiếu soái, chào anh!" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-other" />
                                        <div className="rank-number rank-single">
                                            <div className="rank-text">9</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-50">Thiếu soái, chào anh!</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        {/* Book 10 */}
                        <SwiperSlide>
                            <div className="book-item">
                                <div className="book-content">
                                    <div className="book-image-container">
                                        <div className="book-image-wrapper">
                                            <img className="book-image" src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/0/18876.jpg?v=1&w=350&h=510" alt="Đắc nhân tâm" />
                                        </div>
                                        <div className="book-overlay" />
                                        <div className="member-badge">
                                            <div className="badge-content">
                                                <div className="badge-text">Hội viên</div>
                                            </div>
                                            <div className="badge-icon-container">
                                                <div className="badge-icon-wrapper">
                                                    <div className="badge-icon">
                                                        <div className="icon-background" />
                                                        <div className="icon-foreground" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rank-overlay rank-other" />
                                        <div className="rank-number rank-10">
                                            <div className="rank-text">10</div>
                                        </div>
                                    </div>
                                    <div className="book-title">
                                        <div className="title-text title-15-50">Đắc nhân tâm</div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                    </Swiper>

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