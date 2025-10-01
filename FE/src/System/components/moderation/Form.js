import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Alert,
    CircularProgress,
    Box,
    Chip,
    FormControlLabel,
    Switch,
    Divider
} from '@mui/material';
import {
    Security as SecurityIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { contentModerationAPI } from '../../../Util/Api';
import './Form.scss';

const ModerationForm = ({ open, moderationWord, onClose }) => {
    const [formData, setFormData] = useState({
        word: '',
        severity: 'medium',
        category: 'other',
        language: 'vi',
        description: '',
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (open) {
            if (moderationWord) {
                // Edit mode - populate form with moderation word data
                setFormData({
                    word: moderationWord.word || '',
                    severity: moderationWord.severity || 'medium',
                    category: moderationWord.category || 'other',
                    language: moderationWord.language || 'vi',
                    description: moderationWord.description || '',
                    isActive: moderationWord.isActive !== undefined ? moderationWord.isActive : true
                });
            } else {
                // Create mode - reset form
                setFormData({
                    word: '',
                    severity: 'medium',
                    category: 'other',
                    language: 'vi',
                    description: '',
                    isActive: true
                });
            }
            setErrors({});
            setError('');
            setSuccess('');
        }
    }, [moderationWord, open]);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSwitchChange = (field) => (event) => {
        const value = event.target.checked;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Word validation
        if (!formData.word.trim()) {
            newErrors.word = 'Word is required';
        } else if (formData.word.trim().length < 1) {
            newErrors.word = 'Word must be at least 1 character';
        } else if (formData.word.trim().length > 255) {
            newErrors.word = 'Word must be less than 255 characters';
        }

        // Description validation
        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitData = {
                word: formData.word.trim(),
                severity: formData.severity,
                category: formData.category,
                language: formData.language,
                description: formData.description.trim(),
                isActive: formData.isActive
            };

            let result;
            if (moderationWord) {
                // Update existing moderation word
                result = await contentModerationAPI.updateModerationWord(moderationWord.moderationId, submitData);
            } else {
                // Create new moderation word
                result = await contentModerationAPI.createModerationWord(submitData);
            }

            if (result.success) {
                setSuccess(result.message || (moderationWord ? 'Moderation word updated successfully' : 'Moderation word created successfully'));
                setTimeout(() => {
                    onClose(true); // Refresh the moderation words list
                }, 1500);
            } else {
                setError(result.message || 'Operation failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical': return <WarningIcon color="error" />;
            case 'high': return <WarningIcon color="warning" />;
            case 'medium': return <InfoIcon color="info" />;
            case 'low': return <CheckCircleIcon color="success" />;
            default: return <InfoIcon color="info" />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'profanity': return 'error';
            case 'violence': return 'warning';
            case 'hate_speech': return 'error';
            case 'sexual': return 'warning';
            case 'spam': return 'info';
            case 'political': return 'secondary';
            case 'religious': return 'secondary';
            default: return 'default';
        }
    };

    const formatCategory = (category) => {
        return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: { maxHeight: '90vh' }
            }}
            className="moderation-form-dialog"
        >
            <DialogTitle className="dialog-title">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="primary" />
                    <Typography variant="h5" component="div">
                        {moderationWord ? 'Edit Moderation Word' : 'Add New Moderation Word'}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent className="dialog-content">
                <Box sx={{ mt: 2 }}>
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

                    {/* Form Fields */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Word"
                                value={formData.word}
                                onChange={handleInputChange('word')}
                                error={!!errors.word}
                                helperText={errors.word || 'Enter the word or phrase to moderate'}
                                disabled={loading}
                                required
                                className="form-field"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.severity}>
                                <InputLabel>Severity Level</InputLabel>
                                <Select
                                    value={formData.severity}
                                    onChange={handleInputChange('severity')}
                                    disabled={loading}
                                    label="Severity Level"
                                    className="form-field"
                                >
                                    <MenuItem value="low">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircleIcon color="success" fontSize="small" />
                                            Low
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="medium">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <InfoIcon color="info" fontSize="small" />
                                            Medium
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="high">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <WarningIcon color="warning" fontSize="small" />
                                            High
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="critical">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <WarningIcon color="error" fontSize="small" />
                                            Critical
                                        </Box>
                                    </MenuItem>
                                </Select>
                                {errors.severity && (
                                    <Typography color="error" variant="caption">
                                        {errors.severity}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.category}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={formData.category}
                                    onChange={handleInputChange('category')}
                                    disabled={loading}
                                    label="Category"
                                    className="form-field"
                                >
                                    <MenuItem value="profanity">Profanity</MenuItem>
                                    <MenuItem value="violence">Violence</MenuItem>
                                    <MenuItem value="hate_speech">Hate Speech</MenuItem>
                                    <MenuItem value="sexual">Sexual Content</MenuItem>
                                    <MenuItem value="spam">Spam</MenuItem>
                                    <MenuItem value="political">Political</MenuItem>
                                    <MenuItem value="religious">Religious</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                {errors.category && (
                                    <Typography color="error" variant="caption">
                                        {errors.category}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Language</InputLabel>
                                <Select
                                    value={formData.language}
                                    onChange={handleInputChange('language')}
                                    disabled={loading}
                                    label="Language"
                                    className="form-field"
                                >
                                    <MenuItem value="vi">Vietnamese (vi)</MenuItem>
                                    <MenuItem value="en">English (en)</MenuItem>
                                    <MenuItem value="zh">Chinese (zh)</MenuItem>
                                    <MenuItem value="ja">Japanese (ja)</MenuItem>
                                    <MenuItem value="ko">Korean (ko)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={handleSwitchChange('isActive')}
                                            disabled={loading}
                                            color="primary"
                                        />
                                    }
                                    label="Active"
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                error={!!errors.description}
                                helperText={errors.description || 'Optional description or context for this moderation word'}
                                disabled={loading}
                                placeholder="Enter a description or context for this moderation word..."
                                className="form-field"
                            />
                        </Grid>
                    </Grid>

                    {/* Preview Section */}
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        Preview
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {formData.word || 'Word preview'}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Chip
                                    icon={getSeverityIcon(formData.severity)}
                                    label={formData.severity}
                                    color={getSeverityColor(formData.severity)}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <Chip
                                    label={formatCategory(formData.category)}
                                    color={getCategoryColor(formData.category)}
                                    size="small"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item>
                                <Chip
                                    label={formData.language.toUpperCase()}
                                    size="small"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item>
                                <Chip
                                    icon={formData.isActive ? <CheckCircleIcon /> : <WarningIcon />}
                                    label={formData.isActive ? 'Active' : 'Inactive'}
                                    color={formData.isActive ? 'success' : 'default'}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        {formData.description && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                {formData.description}
                            </Typography>
                        )}
                    </Box>

                    {/* Information Section */}
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        Information
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, border: '1px solid', borderColor: 'info.main' }}>
                        <Typography variant="body2" sx={{ color: 'info.dark' }}>
                            <strong>Severity Levels:</strong><br />
                            • <strong>Critical:</strong> Immediate blocking (severe profanity, threats)<br />
                            • <strong>High:</strong> Strong moderation (violence, hate speech)<br />
                            • <strong>Medium:</strong> Moderate filtering (inappropriate content)<br />
                            • <strong>Low:</strong> Light filtering (mild inappropriate content)
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions className="dialog-actions">
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'Saving...' : (moderationWord ? 'Update Word' : 'Create Word')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModerationForm;
