import React from 'react';
import './Support.scss';

function Support() {
    // The ticket submission flow is currently not active — quick-contact and FAQ are shown instead.

    return (
        <div className="support-container">
            <div className="section-header">
                <h2>Customer Support</h2>
                <p>We are here to help you 24/7</p>
            </div>

            <div className="support-grid">
                <div className="contact-panel">
                    <h3>Quick Contact</h3>
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
                                <div className="title">Policies & Guides</div>
                                    <div className="desc">See frequently asked questions</div>
                            </div>
                        </a>
                    </div>
                </div>

                {/* <div className="ticket-panel">
                    <h3>Submit a support request</h3>
                    {submitted && (
                        <div className="submit-success">Thank you — your request has been received.</div>
                    )}
                    <form className="support-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-field">
                                <label>Full name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
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
                                <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Describe your issue"
                            />
                        </div>
                        <div className="form-field">
                                <label>Message</label>
                            <textarea
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Describe your issue in detail so we can assist you better"
                            />
                        </div>
                        <button className="submit-btn" type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Send request'}
                        </button>
                    </form>
                </div> */}
            </div>

            <div className="faq-panel">
                <h3>FAQ - Frequently Asked Questions</h3>
                <details>
                    <summary>What if I forgot my password?</summary>
                    <p>Use the "Forgot password" feature on the sign-in page to reset it.</p>
                </details>
                <details>
                    <summary>I can't read a book I purchased — what should I do?</summary>
                    <p>Please sign in with the account used for purchase and check your network connection.</p>
                </details>
                <details>
                    <summary>How do I cancel membership renewal?</summary>
                    <p>Go to Transaction History to manage your plan and request cancellation.</p>
                </details>
            </div>
        </div>
    );
}

export default Support;
