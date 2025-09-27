import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Divider,
    Paper,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Category as CategoryIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Favorite as FavoriteIcon,
    Book as BookIcon
} from '@mui/icons-material';
import { typeAPI } from '../../Util/Api';
import './FavouriteTypeForm.scss';

const FavouriteTypeForm = ({ userData, onComplete, onSkip }) => {
    const [types, setTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await typeAPI.getAllTypes({
                pageSize: 100,
                isActive: true,
                sortBy: 'name',
                sortOrder: 'ASC'
            });

            if (result.success && result.data?.DT?.types) {
                setTypes(result.data.DT.types);
            } else {
                setError(result.message || 'Failed to load types');
            }
        } catch (err) {
            setError('An unexpected error occurred while loading types');
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (event) => {
        const value = event.target.value;
        setSelectedTypes(typeof value === 'string' ? value.split(',').map(id => parseInt(id)) : value);
    };

    const toggleTypeSelection = (typeId) => {
        setSelectedTypes(prev => {
            if (prev.includes(typeId)) {
                return prev.filter(id => id !== typeId);
            } else if (prev.length < 5) {
                return [...prev, typeId];
            }
            return prev;
        });
    };

    const handleSave = async () => {
        if (selectedTypes.length === 0) {
            setError('Please select at least one favourite type');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Add each selected type to user's favourites
            const promises = selectedTypes.map(typeId =>
                typeAPI.addUserFavouriteType(userData.id || userData.userId, typeId)
            );

            const results = await Promise.all(promises);
            const failedResults = results.filter(result => !result.success);

            if (failedResults.length === 0) {
                setSuccess('Favourite types saved successfully!');
                setTimeout(() => {
                    onComplete();
                }, 1500);
            } else {
                setError('Some types could not be saved. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred while saving your preferences');
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = () => {
        if (window.confirm('Are you sure you want to skip? You can set your favourite types later in your profile.')) {
            onSkip();
        }
    };

    const getSelectedTypeNames = () => {
        return selectedTypes.map(typeId => {
            const type = types.find(t => t.typeId === typeId);
            return type ? type.name : `Type ${typeId}`;
        });
    };

    const getTypeDescription = (type) => {
        return type.description || 'No description available';
    };

    const getTypeIcon = (typeName) => {
        if (typeName.toLowerCase().includes('kinh doanh') || typeName.toLowerCase().includes('marketing')) {
            return '💼';
        } else if (typeName.toLowerCase().includes('truyện') || typeName.toLowerCase().includes('tiểu thuyết')) {
            return '📚';
        } else if (typeName.toLowerCase().includes('khoa học') || typeName.toLowerCase().includes('công nghệ')) {
            return '🔬';
        } else if (typeName.toLowerCase().includes('sức khỏe') || typeName.toLowerCase().includes('làm đẹp')) {
            return '💊';
        } else if (typeName.toLowerCase().includes('tài chính') || typeName.toLowerCase().includes('đầu tư')) {
            return '💰';
        } else if (typeName.toLowerCase().includes('thiếu nhi')) {
            return '🧸';
        } else if (typeName.toLowerCase().includes('ngôn tình')) {
            return '💕';
        } else if (typeName.toLowerCase().includes('trinh thám') || typeName.toLowerCase().includes('kinh dị')) {
            return '🕵️';
        } else {
            return '📖';
        }
    };

    return (
        <Box className="favourite-type-form">
            <Paper elevation={3} className="form-container">
                <Box className="form-header">
                    <Box className="header-content">
                        <CategoryIcon className="header-icon" />
                        <Typography variant="h4" className="header-title">
                            Chọn thể loại sách yêu thích
                        </Typography>
                        <Typography variant="body1" className="header-subtitle">
                            Giúp chúng tôi cá nhân hóa trải nghiệm đọc sách online của bạn
                        </Typography>
                    </Box>
                </Box>

                <Divider className="divider" />

                <Box className="form-content">
                    {/* Alerts */}
                    {error && (
                        <Alert severity="error" onClose={() => setError('')} className="alert">
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess('')} className="alert">
                            {success}
                        </Alert>
                    )}

                    {/* Selection Summary */}
                    {selectedTypes.length > 0 && (
                        <Box className="selection-summary">
                            <Typography variant="h6" className="summary-title">
                                Selected Types ({selectedTypes.length}/5):
                            </Typography>
                            <Box className="selected-chips">
                                {getSelectedTypeNames().map((typeName, index) => (
                                    <Chip
                                        key={index}
                                        label={typeName}
                                        color="primary"
                                        variant="filled"
                                        icon={<FavoriteIcon />}
                                        className="selected-chip"
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Types Grid */}
                    {loading ? (
                        <Box className="loading-container">
                            <CircularProgress size={60} />
                            <Typography variant="body1" className="loading-text">
                                Loading types...
                            </Typography>
                        </Box>
                    ) : (
                        <Box className="types-section">
                            <Typography variant="h6" className="section-title">
                                Select up to 5 favourite types:
                            </Typography>

                            <Grid container spacing={2} className="types-grid">
                                {types.map((type) => {
                                    const isSelected = selectedTypes.includes(type.typeId);
                                    const isDisabled = !isSelected && selectedTypes.length >= 5;

                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={type.typeId}>
                                            <Card
                                                className={`type-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                                onClick={() => !isDisabled && toggleTypeSelection(type.typeId)}
                                            >
                                                <CardContent className="type-card-content">
                                                    <Box className="type-header">
                                                        <Typography className="type-emoji">
                                                            {getTypeIcon(type.name)}
                                                        </Typography>
                                                        <Box className="type-info">
                                                            <Typography variant="h6" className="type-name">
                                                                {type.name}
                                                            </Typography>
                                                            <Typography variant="body2" className="type-description">
                                                                {getTypeDescription(type)}
                                                            </Typography>
                                                        </Box>
                                                        {isSelected && (
                                                            <CheckIcon className="check-icon" />
                                                        )}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}



                </Box>

                <Divider className="divider" />

                <Box className="form-actions">
                    <Button
                        variant="outlined"
                        onClick={handleSkip}
                        disabled={saving}
                        className="skip-button"
                    >
                        Skip for now
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving || selectedTypes.length === 0}
                        startIcon={saving ? <CircularProgress size={20} /> : <CheckIcon />}
                        className="save-button"
                    >
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default FavouriteTypeForm;
