import React from 'react';
import './MyOrder.scss';

function MyOrder() {
    return (
        <div className="my-order-container">
            <div className="section-header">
                <h2>Quản lý đơn hàng</h2>
                <p>Theo dõi và quản lý các đơn hàng của bạn</p>
            </div>

            <div className="placeholder-content">
                <div className="placeholder-icon">📋</div>
                <h3>Quản lý đơn hàng</h3>
                <p>Chức năng này đang được phát triển và sẽ sớm có mặt!</p>
                <div className="coming-features">
                    <div className="feature-item">✓ Xem lịch sử đơn hàng</div>
                    <div className="feature-item">✓ Theo dõi trạng thái đơn hàng</div>
                    <div className="feature-item">✓ Đánh giá sản phẩm đã mua</div>
                    <div className="feature-item">✓ Yêu cầu hoàn tiền</div>
                </div>
            </div>
        </div>
    );
}

export default MyOrder;
