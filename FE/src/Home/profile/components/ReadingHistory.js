import React, { useEffect, useState } from 'react';
import { readingHistoryAPI } from '../../../Util/Api';
import { useNavigate } from 'react-router-dom';
import './ReadingHistory.scss';

const ReadingHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                const res = await readingHistoryAPI.list(user.id, 100);
                if (res.success) {
                    setHistory(res.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading reading history...</div>;
    }

    if (!history || history.length === 0) {
        return <div>No reading history yet.</div>;
    }

    const onClickCard = (ebookId) => {
        navigate(`/book/${ebookId}`);
    };

    return (
        <div className="reading-history-list">
            <div className="grid">
                {history.map((item) => (
                    <div key={item.id} className="history-card" onClick={() => onClickCard(item.ebookId)}>
                        <div className="thumb">
                            {item.ebook?.coverImage ? (
                                <img src={`http://localhost:8080/public${item.ebook.coverImage}`} alt={item.ebook?.title || 'Ebook'} />
                            ) : (
                                <div className="placeholder">No Cover</div>
                            )}
                        </div>
                        <div className="meta">
                            <div className="title">{item.ebook?.title || 'Unknown title'}</div>
                            <div className="author">{item.ebook?.customAuthor || item.ebook?.author?.name || 'Unknown author'}</div>
                            <div className="time">Last read: {new Date(item.lastReadAt || item.updated_at || item.created_at).toLocaleString('en-US')}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReadingHistory;


