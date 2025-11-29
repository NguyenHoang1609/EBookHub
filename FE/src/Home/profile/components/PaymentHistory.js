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
        return date.toLocaleString('en-US');
    };

    if (!user) {
        return (
            <div className="payment-history-container">
                    <div className="section-header">
                        <h2>Transaction History</h2>
                        <p>Review your payment and top-up transactions</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">💳</div>
                    <h3>Please sign in to view your transaction history</h3>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="payment-history-container">
                <div className="section-header">
                    <h2>Transaction History</h2>
                    <p>Review your payment and top-up transactions</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">💳</div>
                    <h3>Loading data...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-history-container">
            <div className="section-header">
                <h2>Transaction History</h2>
                <p>Review your payment and top-up transactions</p>
            </div>
            {payments.length === 0 ? (
                <div className="placeholder-content">
                    <div className="placeholder-icon">💳</div>
                    <h3>No transactions yet</h3>
                    <p>You have not made any transactions on the system.</p>
                </div>
            ) : (
                <div className="payment-table-wrapper">
                    <table className="payment-table">
                        <thead>
                            <tr>
                                <th>Transaction date</th>
                                <th>Amount (VND)</th>
                                <th>Status</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p, idx) => (
                                <tr key={p.id || idx}>
                                    <td>{formatDate(p.transactionDate || p.created_at)}</td>
                                    <td>{Number(p.amount || p.transferAmount || 0).toLocaleString('en-US')}</td>
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
