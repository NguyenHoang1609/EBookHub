import React, { useEffect, useState } from 'react';
import './PaymentHistory.scss';
import { paymentAPI } from '../../../Util/Api';

function PaymentHistory() {
    const [user, setUser] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const u = JSON.parse(userData);
            setUser(u);
            fetchPayments(u.id);
        }
    }, []);

    const fetchPayments = async (userId) => {
        setLoading(true);
        const res = await paymentAPI.getByUser(userId);
        setPayments(res.success && Array.isArray(res.data) ? res.data : []);
        setLoading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    if (!user) {
        return (
            <div className="payment-history-container">
                <div className="section-header">
                    <h2>Lịch sử giao dịch</h2>
                    <p>Xem lại các giao dịch thanh toán và nạp tiền</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">💳</div>
                    <h3>Vui lòng đăng nhập để xem lịch sử giao dịch</h3>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="payment-history-container">
                <div className="section-header">
                    <h2>Lịch sử giao dịch</h2>
                    <p>Xem lại các giao dịch thanh toán và nạp tiền</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">💳</div>
                    <h3>Đang tải dữ liệu...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-history-container">
            <div className="section-header">
                <h2>Lịch sử giao dịch</h2>
                <p>Xem lại các giao dịch thanh toán và nạp tiền</p>
            </div>
            {payments.length === 0 ? (
                <div className="placeholder-content">
                    <div className="placeholder-icon">💳</div>
                    <h3>Chưa có giao dịch nào</h3>
                    <p>Bạn chưa thực hiện giao dịch nào trên hệ thống.</p>
                </div>
            ) : (
                <div className="payment-table-wrapper">
                    <table className="payment-table">
                        <thead>
                            <tr>
                                <th>Ngày giao dịch</th>
                                <th>Số tiền (VNĐ)</th>
                                <th>Trạng thái</th>
                                <th>Mô tả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p, idx) => (
                                <tr key={p.id || idx}>
                                    <td>{formatDate(p.transactionDate || p.created_at)}</td>
                                    <td>{Number(p.amount || p.transferAmount || 0).toLocaleString('vi-VN')}</td>
                                    <td>
                                        <span className={`status-badge status-${p.status}`}>{p.status}</span>
                                    </td>
                                    <td>{p.description || p.content || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PaymentHistory;
