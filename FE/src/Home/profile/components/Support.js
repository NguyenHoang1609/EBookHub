import React from 'react';
import './Support.scss';

function Support() {
    return (
        <div className="support-container">
            <div className="section-header">
                <h2>Hỗ trợ khách hàng</h2>
                <p>Liên hệ với đội ngũ hỗ trợ của chúng tôi</p>
            </div>

            <div className="placeholder-content">
                <div className="placeholder-icon">📞</div>
                <h3>Hỗ trợ khách hàng</h3>
                <p>Chức năng này đang được phát triển và sẽ sớm có mặt!</p>
                <div className="coming-features">
                    <div className="feature-item">✓ Chat trực tuyến</div>
                    <div className="feature-item">✓ Gửi ticket hỗ trợ</div>
                    <div className="feature-item">✓ FAQ và hướng dẫn</div>
                    <div className="feature-item">✓ Liên hệ qua email/điện thoại</div>
                </div>
            </div>
        </div>
    );
}

export default Support;
