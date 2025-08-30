import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './Banner.scss';

const Banner = () => {
    const bannerSlides = [
        {
            id: 1,
            image: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/4321.jpg?v=1&w=1920&h=600',
            title: 'Banner 1',
        },
        {
            id: 2,
            image: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/4282.jpg?v=4&w=1920&h=600',
            title: 'Banner 2',
        },
        {
            id: 3,
            image: 'https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/4153.jpg?v=2&w=1920&h=600',
            title: 'Banner 3',
        },

    ];

    return (
        <div className="banner-container">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{
                    el: '.swiper-pagination-custom',
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className} custom-bullet"></span>`;
                    },
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                effect="fade"
                fadeEffect={{
                    crossFade: true
                }}
                loop={true}
                className="banner-swiper"
            >
                {bannerSlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="banner-slide">
                            <div className="banner-image">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    loading="lazy"
                                />
                            </div>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="swiper-button-prev-custom">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="swiper-button-next-custom">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>


        </div>
    );
};

export default Banner;
