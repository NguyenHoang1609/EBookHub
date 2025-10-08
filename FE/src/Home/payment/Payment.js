import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '../component/Navigation';
import Footer from '../component/Footer';
import styles from './Payment.module.scss';
import { paymentAPI } from '../../Util/Api';

const TIERS = [
    { id: '3m', label: '3 Tháng', price: 199000 },
    { id: '6m', label: '6 Tháng', price: 399000 },
    { id: '12m', label: '12 Tháng', price: 499000 }
];

const FIXED_CHECK_AMOUNT = 2000; // matches backend VIP_PRICE_VND

const Payment = () => {
    const [selectedTier, setSelectedTier] = useState(TIERS[0]);
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [polling, setPolling] = useState(false);
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try { setUser(JSON.parse(userData)); } catch { }
        }
    }, []);

    const qrSrc = useMemo(() => {
        const uid = user?.id || 0;
        return `https://qr.sepay.vn/img?acc=0383984836&bank=MBBank&amount=${FIXED_CHECK_AMOUNT}&des=DH${uid}&template=compact`;
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
        'Đọc không giới hạn ebook VIP',
        'Bỏ quảng cáo',
        `${months} tháng hỗ trợ ưu tiên`,
        'Ưu đãi thành viên độc quyền'
    ]);

    const savingsText = (id) => {
        if (id === '6m') return 'Tiết kiệm 15% so với trả 3 tháng x2';
        if (id === '12m') return 'Tiết kiệm 30% so với trả theo tháng';
        return 'Bắt đầu trải nghiệm VIP ngay';
    };

    return (
        <div className={styles.payment}>
            <Navigation />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Nâng cấp Hội viên VIP</h1>
                    <p className={styles.subtitle}>Chọn gói phù hợp với bạn</p>
                </div>

                <div className={styles.tiersGrid}>
                    {TIERS.map(t => (
                        <div key={t.id} className={`${styles.card} ${selectedTier.id === t.id ? styles.active : ''}`} onClick={() => setSelectedTier(t)}>

                            <div className={styles.cardHeader}>
                                <div className={styles.plan}>{t.label}</div>
                                <div className={styles.price}>{t.price.toLocaleString('vi-VN')}đ</div>
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
                            <button className={styles.buyBtn} onClick={() => setModalOpen(true)}>Mua gói</button>
                            <div className={styles.footnote}>Thanh toán qua QR. Kích hoạt tự động sau vài giây.</div>
                        </div>
                    ))}
                </div>

                {modalOpen && (
                    <div className={styles.overlay} onClick={() => setModalOpen(false)}>
                        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.panelLeft}>
                                <h3 className={styles.panelTitle}>Quét mã thanh toán</h3>
                                <div className={styles.qrBox}>
                                    <img className={styles.qr} src={qrSrc} alt="QR Payment" />
                                </div>
                                <div className={styles.status}>
                                    <div className={styles.note}>Sử dụng ứng dụng ngân hàng để quét mã.</div>
                                    {polling && <div className={styles.polling}>Đang kiểm tra thanh toán...</div>}
                                    {paid && <div className={styles.success}>Thanh toán thành công! Tài khoản đã kích hoạt VIP.</div>}
                                    {error && <div className={styles.error}>{error}</div>}
                                </div>
                            </div>
                            <div className={styles.panelRight}>
                                <h3 className={styles.panelTitle}>Thông tin chuyển khoản</h3>
                                <div className={styles.infoCol}>
                                    <div className={styles.row}><span className={styles.label}>Ngân hàng</span><span className={styles.value}>MBBank</span></div>
                                    <div className={styles.row}><span className={styles.label}>Chủ tài khoản</span><span className={styles.value}>SEPAY DEMO</span></div>
                                    <div className={styles.row}><span className={styles.label}>Số tài khoản</span><span className={styles.value}>0383984836</span></div>
                                    <div className={styles.row}><span className={styles.label}>Số tiền xác thực</span><span className={styles.value}>{FIXED_CHECK_AMOUNT.toLocaleString('vi-VN')}đ</span></div>
                                    <div className={styles.row}><span className={styles.label}>Nội dung</span><span className={styles.value}>DH{user?.id}</span></div>
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.outlineBtn} onClick={() => setModalOpen(false)}>Đóng</button>
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
