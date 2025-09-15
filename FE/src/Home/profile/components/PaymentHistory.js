import React from 'react';
import './PaymentHistory.scss';

function PaymentHistory() {
    return (
        <div className="payment-history-container">
            <div className="section-header">
                <h2>Lịch sử giao dịch</h2>
                <p>Xem lại các giao dịch thanh toán và nạp tiền</p>
            </div>

            <div className="placeholder-content">
                <div className="placeholder-icon">💳</div>
                <h3>Lịch sử giao dịch</h3>
                <p>Chức năng này đang được phát triển và sẽ sớm có mặt!</p>
                <div className="coming-features">
                    <div className="feature-item">✓ Lịch sử mua sách</div>
                    <div className="feature-item">✓ Lịch sử nạp Sồi</div>
                    <div className="feature-item">✓ Báo cáo chi tiêu</div>
                    <div className="feature-item">✓ Xuất hóa đơn</div>
                </div>
            </div>
        </div>
    );
}

export default PaymentHistory;
