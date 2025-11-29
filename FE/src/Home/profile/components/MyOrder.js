import React from 'react';
import './MyOrder.scss';

function MyOrder() {
    return (
        <div className="my-order-container">
            <div className="section-header">
                <h2>Order Management</h2>
                <p>Track and manage your orders</p>
            </div>

            <div className="placeholder-content">
                <div className="placeholder-icon">📋</div>
                <h3>Manage Orders</h3>
                <p>This feature is under development and coming soon!</p>
                <div className="coming-features">
                    <div className="feature-item">✓ View order history</div>
                    <div className="feature-item">✓ Track order status</div>
                    <div className="feature-item">✓ Review purchased items</div>
                    <div className="feature-item">✓ Request refund</div>
                </div>
            </div>
        </div>
    );
}

export default MyOrder;
