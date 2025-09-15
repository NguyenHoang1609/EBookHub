import React from 'react';
import './SelfBook.scss';

function SelfBook() {
    return (
        <div className="self-book-container">
            <div className="section-header">
                <h2>Tủ sách cá nhân</h2>
                <p>Quản lý các cuốn sách bạn đã mua và sở hữu</p>
            </div>

            <div className="placeholder-content">
                <div className="placeholder-icon">📚</div>
                <h3>Tủ sách cá nhân</h3>
                <p>Chức năng này đang được phát triển và sẽ sớm có mặt!</p>
                <div className="coming-features">
                    <div className="feature-item">✓ Xem danh sách sách đã mua</div>
                    <div className="feature-item">✓ Tìm kiếm và lọc sách</div>
                    <div className="feature-item">✓ Đánh dấu sách yêu thích</div>
                    <div className="feature-item">✓ Theo dõi tiến độ đọc</div>
                </div>
            </div>
        </div>
    );
}

export default SelfBook;
