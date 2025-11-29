import React, { useEffect, useMemo, useState } from 'react';
import './MyFavouriteType.scss';
import { typeAPI } from '../../../Util/Api';

function MyFavouriteType() {
    const [user, setUser] = useState(null);
    const [allTypes, setAllTypes] = useState([]);
    const [favouriteTypeIds, setFavouriteTypeIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const u = JSON.parse(userData);
            setUser(u);
            fetchData(u.id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchData = async (userId) => {
        setLoading(true);
        try {
            const [typesRes, favRes] = await Promise.all([
                typeAPI.getAllTypes(),
                typeAPI.getUserFavouriteTypes(userId)
            ]);

            const types = typesRes.success && Array.isArray(typesRes.data?.DT.types)
                ? typesRes.data.DT.types
                : [];
            setAllTypes(types);

            const favIds = favRes.success && Array.isArray(favRes.data?.DT)
                ? new Set(favRes.data.DT.map((t) => t.typeId || t.id || t.type?.typeId))
                : new Set();
            setFavouriteTypeIds(favIds);
        } catch (error) {
            console.error('Error loading favourite types:', error);
        }
        setLoading(false);
    };

    const isSelected = (typeId) => favouriteTypeIds.has(typeId);

    const toggleType = async (typeId) => {
        if (!user || saving) return;
        setSaving(true);
        setMessage('');
        try {
            if (isSelected(typeId)) {
                const res = await typeAPI.removeUserFavouriteType(user.id, typeId);
                if (res.success) {
                    setFavouriteTypeIds((prev) => {
                        const next = new Set(prev);
                        next.delete(typeId);
                        return next;
                    });
                } else {
                    setMessage(res.message || 'Unable to remove category selection.');
                }
            } else {
                const res = await typeAPI.addUserFavouriteType(user.id, typeId);
                if (res.success) {
                    setFavouriteTypeIds((prev) => new Set(prev).add(typeId));
                } else {
                    setMessage(res.message || 'Unable to add favorite category.');
                }
            }
        } catch (error) {
            console.error('Update favourite type error:', error);
            setMessage('An error occurred. Please try again.');
        }
        setSaving(false);
    };

    const selectedCount = useMemo(() => favouriteTypeIds.size, [favouriteTypeIds]);

    if (!user) {
        return (
            <div className="fav-type-container">
                <div className="section-header">
                        <h2>Favorite Categories</h2>
                            <p>Select categories you are interested in to get tailored suggestions</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">💙</div>
                    <h3>Please sign in to manage favorite categories</h3>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="fav-type-container">
                    <div className="section-header">
                        <h2>Favorite Categories</h2>
                        <p>Select the genres you're interested in to get tailored recommendations</p>
                </div>
                <div className="placeholder-content">
                    <div className="placeholder-icon">💙</div>
                    <h3>Loading data...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="fav-type-container">
            <div className="section-header">
                <h2>Favorite Categories</h2>
                <p>Select categories you are interested in to receive recommended books</p>
            </div>

            <div className="toolbar">
                <div className="summary">Selected: {selectedCount}</div>
                {message && <div className="message">{message}</div>}
            </div>

            {allTypes.length === 0 ? (
                <div className="placeholder-content">
                    <div className="placeholder-icon">💙</div>
                    <h3>No categories available</h3>
                </div>
            ) : (
                <div className="type-grid">
                    {allTypes.map((t) => (
                        <button
                            key={t.typeId || t.id}
                            className={`type-chip ${isSelected(t.typeId || t.id) ? 'selected' : ''}`}
                            onClick={() => toggleType(t.typeId || t.id)}
                            disabled={saving}
                            aria-pressed={isSelected(t.typeId || t.id)}
                        >
                            <span className="chip-label">{t.name}</span>
                            {isSelected(t.typeId || t.id) && <span className="check">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyFavouriteType;


