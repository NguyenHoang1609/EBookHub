import React, { useState } from 'react';
import './Support.scss';

function Support() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        setSubmitting(true);
        try {
            // Placeholder submit: you can wire this to backend later
            await new Promise((resolve) => setTimeout(resolve, 800));
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="support-container">
            <div className="section-header">
                <h2>Hỗ trợ khách hàng</h2>
                <p>Chúng tôi luôn sẵn sàng trợ giúp bạn 24/7</p>
            </div>

            <div className="support-grid">
                <div className="contact-panel">
                    <h3>Liên hệ nhanh</h3>
                    <div className="contact-items">
                        <a className="contact-item" href="mailto:support@ebook.example">
                            <span className="icon">📧</span>
                            <div>
                                <div className="title">Email</div>
                                <div className="desc">support@ebook.example</div>
                            </div>
                        </a>
                        <a className="contact-item" href="tel:+84123456789">
                            <span className="icon">📞</span>
                            <div>
                                <div className="title">Hotline</div>
                                <div className="desc">+84 123 456 789</div>
                            </div>
                        </a>
                        <a className="contact-item" href="/policy" rel="noopener">
                            <span className="icon">📄</span>
                            <div>
                                <div className="title">Chính sách & Hướng dẫn</div>
                                <div className="desc">Xem các câu hỏi thường gặp</div>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="ticket-panel">
                    <h3>Gửi yêu cầu hỗ trợ</h3>
                    {submitted && (
                        <div className="submit-success">Cảm ơn bạn! Yêu cầu đã được ghi nhận.</div>
                    )}
                    <form className="support-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-field">
                                <label>Họ và tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            <div className="form-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@domain.com"
                                />
                            </div>
                        </div>
                        <div className="form-field">
                            <label>Chủ đề</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Vấn đề bạn gặp phải"
                            />
                        </div>
                        <div className="form-field">
                            <label>Nội dung</label>
                            <textarea
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết vấn đề để chúng tôi hỗ trợ tốt hơn"
                            />
                        </div>
                        <button className="submit-btn" type="submit" disabled={submitting}>
                            {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="faq-panel">
                <h3>FAQ - Câu hỏi thường gặp</h3>
                <details>
                    <summary>Tôi quên mật khẩu thì làm sao?</summary>
                    <p>Hãy sử dụng chức năng "Quên mật khẩu" tại trang đăng nhập để đặt lại.</p>
                </details>
                <details>
                    <summary>Tôi không đọc được sách đã mua?</summary>
                    <p>Vui lòng đăng nhập đúng tài khoản đã thanh toán và kiểm tra kết nối mạng.</p>
                </details>
                <details>
                    <summary>Làm sao để hủy gia hạn hội viên?</summary>
                    <p>Vào mục Lịch sử giao dịch để quản lý gói và yêu cầu hủy.</p>
                </details>
            </div>
        </div>
    );
}

export default Support;
