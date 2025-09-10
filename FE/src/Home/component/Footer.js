import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Company Information Section */}
                <div className="footer-section company-info">
                    <div className="logo-section">
                        <div className="waka-logo"></div>
                        <p className="company-name">Công ty cổ phần sách điện tử Waka</p>
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="icon-phone"></div>
                                <span>0877736289</span>
                            </div>
                            <div className="contact-item">
                                <div className="icon-email"></div>
                                <span>Support@waka.vn</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Us Section */}
                <div className="footer-section">
                    <h3 className="section-title">Về chúng tôi</h3>
                    <div className="link-columns">
                        <div className="link-column">
                            <a href="#" className="footer-link">Giới thiệu</a>
                            <a href="#" className="footer-link">Cơ cấu tổ chức</a>
                            <a href="#" className="footer-link">Lĩnh vực hoạt động</a>
                        </div>
                        <div className="link-column">
                            <a href="#" className="footer-link">Cơ hội đầu tư</a>
                            <a href="#" className="footer-link">Tuyển dụng</a>
                            <a href="#" className="footer-link">Liên hệ</a>
                            <a href="#" className="footer-link">Dịch vụ xuất bản sách</a>
                        </div>
                    </div>
                </div>

                {/* Useful Information Section */}
                <div className="footer-section">
                    <h3 className="section-title">Thông tin hữu ích</h3>
                    <div className="link-list">
                        <a href="#" className="footer-link">Thỏa thuận sử dụng dịch vụ</a>
                        <a href="#" className="footer-link">Quyền lợi</a>
                        <a href="#" className="footer-link">Quy định riêng tư</a>
                        <a href="#" className="footer-link">Quy chế hoạt động sàn TMĐT</a>
                        <a href="#" className="footer-link">Câu hỏi thường gặp</a>
                    </div>
                </div>

                {/* News Section */}
                <div className="footer-section">
                    <h3 className="section-title">Tin tức</h3>
                    <div className="link-list">
                        <a href="#" className="footer-link">Tin dịch vụ</a>
                        <a href="#" className="footer-link">Review sách</a>
                        <a href="#" className="footer-link">Lịch phát hành</a>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="footer-section social-section">
                    <div className="social-icons">
                        <div className="qr-code"></div>
                        <div className="social-links">
                            <div className="social-icon"></div>
                            <div className="social-icon"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Download Section */}
            <div className="app-download">
                <div className="app-logo"></div>
            </div>

            {/* Legal Information */}
            <div className="legal-info">
                <p>Công ty Cổ phần Sách điện tử Waka - Tầng 6, Tháp văn phòng quốc tế Hòa Bình, số 106 đường Hoàng Quốc Việt, Phường Nghĩa Đô, Thành phố Hà Nội, Việt Nam.</p>
                <p>ĐKKD số 0108796796 do SKHĐT TP Hà Nội cấp lần đầu ngày 24/06/2019.</p>
                <p>Giấy xác nhận Đăng ký hoạt động phát hành xuất bản phẩm điện tử số 8132/XN-CXBIPH do Cục Xuất bản, In và Phát hành cấp ngày 31/12/2019.</p>
                <p>Giấy chứng nhận Đăng ký kết nối để cung cấp dịch vụ nội dung thông tin trên mạng viễn thông di động số 91/GCN-CVT cấp ngày 24/03/2025.</p>
                <p>Người đại diện: (Bà) Phùng Thị Như Quỳnh (Theo Giấy ủy quyền số 2402/GUQ-WAKA/2025 ngày 24/02/2025).</p>
                <p>Người đại diện được ủy quyền phối hợp với CQNN giải quyết các vấn đề liên quan đến bảo vệ quyền lợi Khách hàng: (Bà) Phùng Thị Như Quỳnh - Số điện thoại: 0977756263 - Email: Support@waka.vn. - Địa chỉ liên hệ: Tháp văn phòng quốc tế Hòa Bình, số 106 đường Hoàng Quốc Việt, Phường Nghĩa Đô, Thành phố Hà Nội, Việt Nam.</p>
                <p>Số VPGD: 024.73086566 | Số CSKH: 1900545482 nhánh 5 | Hotline: 0877736289</p>
            </div>
        </footer>
    );
};

export default Footer;




