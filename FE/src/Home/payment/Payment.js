import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../component/Navigation';
import Footer from '../component/Footer';
import styles from './Payment.module.scss';
import { paymentAPI } from '../../Util/Api';

const TIERS = [
    // { id: '3m', label: '3 Months', price: 199000 },
    // { id: '6m', label: '6 Months', price: 399000 },
    { id: 'lifetime', label: 'Membership Plan', price: 200000 }
];

const FIXED_CHECK_AMOUNT = 2000; // matches backend VIP_PRICE_VND

const Payment = () => {
    const [selectedTier, setSelectedTier] = useState(TIERS[0]);
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [polling, setPolling] = useState(false);
    const [paid, setPaid] = useState(false);
    const [error] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try { setUser(JSON.parse(userData)); } catch { }
        }
    }, []);

const qrSrc = useMemo(() => {
    if (!user) return '';
    const uid = user.id;
    return `https://qr.sepay.vn/img?acc=0968246811&bank=MBBank&amount=2000&des=DH${uid}&template=compact`;
}, [user]);


    useEffect(() => {
        let timer;
        let tries = 0;
        async function tick() {
            if (!user) return;
            tries += 1;
            const result = await paymentAPI.status(user.id, FIXED_CHECK_AMOUNT);
            if (result.success && result.data?.data?.DT) {
                const { hasPaid, isVip } = result.data.data.DT;
                if (hasPaid || isVip) {
                    setPaid(true);
                    setPolling(false);
                    return;
                }
            }
            if (tries < 10) {
                timer = setTimeout(tick, 1000);
            } else {
                setPolling(false);
            }
        }
        if (modalOpen) {
            setPaid(false);
            setPolling(true);
            tries = 0;
            timer = setTimeout(tick, 1500);
        }
        return () => timer && clearTimeout(timer);
    }, [modalOpen, user]);

    const featureList = (months) => ([
        'Unlimited VIP ebook reading',
        'Ad-free experience',
        'Exclusive member benefits'
    ]);

    const savingsText = (id) => {
        if (id === '6m') return 'Save 15% compared to paying monthly (6-month plan)';
        if (id === '12m') return 'Save 30% compared to paying monthly (12-month plan)';
        return 'Start your VIP experience now';
    };

    return (
        <div className={styles.payment}>
            <Navigation />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Upgrade to VIP Membership</h1>
                    <p className={styles.subtitle}>Choose a plan that suits you</p>
                </div>

                <div className={styles.tiersGrid}>
                    {TIERS.map(t => (
                        <div key={t.id} className={`${styles.card} ${selectedTier.id === t.id ? styles.active : ''}`} onClick={() => setSelectedTier(t)}>

                            <div className={styles.cardHeader}>
                                <div className={styles.plan}>{t.label}</div>
                                <div className={styles.price}>{t.price.toLocaleString('en-US')} VND</div>
                            </div>
                            <div className={styles.savings}>{savingsText(t.id)}</div>
                            <div className={styles.features}>
                                {featureList(t.id === '3m' ? 3 : t.id === '6m' ? 6 : 12).map((f, i) => (
                                    <div className={styles.feature} key={i}>
                                        <span className={styles.dot}></span>
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                            <button className={styles.buyBtn} onClick={() => setModalOpen(true)}>Buy plan</button>
                            <div className={styles.footnote}>Payment via QR. Activation will happen automatically.</div>
                        </div>
                    ))}
                </div>

                {modalOpen && (
                    <div className={styles.overlay} onClick={() => setModalOpen(false)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.panelLeft}>
                                <h3 className={styles.panelTitle}>Scan QR to Pay</h3>
                                <div className={styles.qrBox}>
                                    <img className={styles.qr} src={qrSrc} alt="QR Payment" />
                                </div>
                                <div className={styles.status}>
                                    <div className={styles.note}>Use your banking app to scan the code.</div>
                                    {polling && <div className={styles.polling}>Checking payment...</div>}
                                    {paid && <div className={styles.success}>Payment successful! Your account is now VIP.</div>}
                                    {error && <div className={styles.error}>{error}</div>}
                                </div>
                            </div>
                            <div className={styles.panelRight}>
                                <h3 className={styles.panelTitle}>Transfer information</h3>
                                <div className={styles.infoCol}>
                                    <div className={styles.row}><span className={styles.label}>Bank</span><span className={styles.value}>MBBank</span></div>
                                    <div className={styles.row}><span className={styles.label}>Account holder</span><span className={styles.value}>SEPAY DEMO</span></div>
                                    <div className={styles.row}><span className={styles.label}>Account number</span><span className={styles.value}>0968246811</span></div>
                                    <div className={styles.row}><span className={styles.label}>Verification amount</span><span className={styles.value}>{FIXED_CHECK_AMOUNT.toLocaleString('en-US')} VND</span></div>
                                    <div className={styles.row}><span className={styles.label}>Reference</span><span className={styles.value}>DH{user?.id}</span></div>
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.outlineBtn} onClick={() => setModalOpen(false)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Payment;
