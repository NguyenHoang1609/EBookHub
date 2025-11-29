import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Company Information Section */}
                <div className="footer-section company-info">
                    <div className="logo-section">
                        <img className="logo-image" src="/logo.png" alt="Hoang Minh eBook logo" />
                        <p className="company-name">Hoang Minh eBook Corporation</p>
                        <div className="contact-info">
                            <div className="contact-item">

                                <span>0968246811</span>
                            </div>
                            <div className="contact-item">
                                <div className="icon-email"></div>
                                <span>nguyenhoang@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Us Section */}
                <div className="footer-section">
                    <h3 className="section-title">About us</h3>
                    <div className="link-columns">
                        <div className="link-column">
                            <a href="/about" className="footer-link">About</a>
                            <a href="/about#organization" className="footer-link">Organization</a>
                            <a href="/about#areas" className="footer-link">Areas of operation</a>
                        </div>
                        <div className="link-column">
                            <a href="/about#invest" className="footer-link">Investment opportunities</a>
                            <a href="/careers" className="footer-link">Careers</a>
                            <a href="/contact" className="footer-link">Contact</a>
                            <a href="/services" className="footer-link">Publishing Services</a>
                        </div>
                    </div>
                </div>

                {/* Useful Information Section */}
                <div className="footer-section">
                    <h3 className="section-title">Useful Information</h3>
                    <div className="link-list">
                        <a href="/terms" className="footer-link">Terms of Service</a>
                        <a href="/benefits" className="footer-link">Benefits</a>
                        <a href="/policy" className="footer-link">Privacy Policy</a>
                        <a href="/policy#ecommerce" className="footer-link">E-commerce Rules</a>
                        <a href="/faq" className="footer-link">FAQ</a>
                    </div>
                </div>

                {/* News Section */}
                <div className="footer-section">
                    <h3 className="section-title">News</h3>
                    <div className="link-list">
                        <a href="/updates" className="footer-link">Service Updates</a>
                        <a href="/reviews" className="footer-link">Book Reviews</a>
                        <a href="/releases" className="footer-link">Release Schedule</a>
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
                <p>Hoang Minh eBook Corp - 6th Floor, Hoa Binh International Office Tower, 106 Hoang Quoc Viet St., Nghia Do Ward, Hanoi, Vietnam.</p>
                <p>Business Registration No.: 0108796796 (issued by Hanoi Department of Planning and Investment, first registered on 24/06/2019).</p>
                <p>Certificate for e-publication distribution No.: 8132/XN-CXBIPH (issued 31/12/2019).</p>
                <p>Certificate of telecom content service connection No.: 91/GCN-CVT (issued 24/03/2025).</p>
                <p>Authorized representative: Mr. Nguyen Minh Hoang (Authorization document 2402/GUQ/2025 dated 24/02/2025).</p>
                <p>Authorized contact for customer protection issues: Nguyen Minh Hoang - Phone: 0968246811 - Email: nguyenhoang@gmail.com - Address: Hoa Binh International Office Tower, 106 Hoang Quoc Viet St., Nghia Do Ward, Hanoi, Vietnam.</p>
                <p>Office: 024.73086566 | Hotline: 0968246811</p>
            </div>
        </footer>
    );
};

export default Footer;




