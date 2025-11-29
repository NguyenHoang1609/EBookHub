import React from 'react';
import Navigation from '../component/Navigation';
import Footer from '../component/Footer';
import './Policy.scss';

const Policy = () => {
    return (
        <div className="policy-page">
            <Navigation />

            <div className="policy-container">
                <div className="policy-header">
                    <h1 className="policy-title">
                        🛡️ Privacy Policy & Data Protection
                    </h1>
                    <p className="policy-update">
                        Last updated: [date]
                    </p>
                </div>

                <div className="policy-content">
                    <div className="policy-section">
                        <p className="policy-intro">
                            The [Your eBook Website] values the privacy of our users, including authors who publish eBooks and readers who use our services. This policy explains how we collect, use and protect personal information while people use our platform.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Information We Collect</h2>
                        <p>
                            When an author publishes an eBook on [Your eBook Website], we may request information such as name, email, phone number and payment details to verify identity, protect copyright and process transactions. We also store book details (title, description, cover image, price) for display and promotion. For readers, account creation requires basic information for authentication and helps the system track purchases, downloads and reading activity to improve personalization.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">How We Use Information</h2>
                        <p>
                            The information we collect is used to operate, maintain, and improve our service. It may be used to process payments, send transaction notifications, provide technical support, or deliver newsletters if you opt in. We do not sell or rent personal information to third parties. In certain situations, data may be shared with payment partners or service providers to support operations or in response to lawful requests from authorities.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Data Security</h2>
                        <p>
                            We implement robust security measures such as encryption, firewalls and access controls to help protect user data. Personal information is stored securely on trusted servers and only authorized staff may access it. Users may request to review, update or delete their personal data. If you do not wish to receive marketing communications, you can opt out or request account deletion.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Cookies and Tracking Technologies</h2>
                        <p>
                            Our website may use cookies and other tracking mechanisms to remember login choices, language preferences and to suggest content tailored to your reading habits. Accepting cookies helps provide a smoother experience; you can disable them in your browser settings, although some features may not work properly.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Copyright & Intellectual Property</h2>
                        <p>
                            All content (ebooks, images, data) uploaded by authors remains the intellectual property of the original authors. [Your eBook Website] is a distribution platform that respects those rights. Users may not copy, republish or misuse purchased or downloaded works. Copyright violations may be addressed according to applicable laws.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Contact</h2>
                        <p>
                            If you have any questions or concerns about your personal data, please contact us at <a href="mailto:contact@tenwebsite.com" className="contact-link">contact@tenwebsite.com</a> or call [hotline]. We will respond promptly and transparently.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Policy Updates</h2>
                        <p>
                            We may update this Privacy Policy from time to time to reflect legal or operational changes. Any updates will be posted on the website and will become effective after a reasonable notice period.
                        </p>
                    </div>

                    <div className="policy-section">
                        <h2 className="section-title">Consent</h2>
                        <p className="policy-conclusion">
                            We aim to provide a secure, transparent and reliable publishing and reading platform. By continuing to use our service, you agree to the terms of this policy.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Policy;
