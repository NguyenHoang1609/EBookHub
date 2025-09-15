import React from 'react';
import './Achivements.scss';

function Achivements() {
    return (
        <div className="achievements-container">
            <div className="section-header">
                <h2>Thành tích</h2>
                <p>Xem các thành tích và huy hiệu bạn đã đạt được</p>
            </div>

            <div className="placeholder-content">
                <div className="placeholder-icon">🏆</div>
                <h3>Thành tích</h3>
                <p>Chức năng này đang được phát triển và sẽ sớm có mặt!</p>
                <div className="coming-features">
                    <div className="feature-item">✓ Huy hiệu đọc sách</div>
                    <div className="feature-item">✓ Thống kê thời gian đọc</div>
                    <div className="feature-item">✓ Bảng xếp hạng người đọc</div>
                    <div className="feature-item">✓ Mục tiêu đọc sách</div>
                </div>
            </div>
        </div>
    );
}

export default Achivements;
