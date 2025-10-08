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
    FormControlLabel,
    Switch,
    Typography,
    Alert,
    CircularProgress,
    Box,
    Divider,
    Chip
} from '@mui/material';
import { userAPI } from '../../../Util/Api';

const UserForm = ({ open, user, isViewMode = false, groups = [], onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        groupId: 3,
        isActive: true
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user && !isViewMode) {
            // Edit mode - populate form with user data
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                password: '',
                confirmPassword: '',
                groupId: user.groupId || 3,
                isActive: user.isActive !== undefined ? user.isActive : true
            });
        } else if (user && isViewMode) {
            // View mode - populate form with user data (read-only)
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                password: '',
                confirmPassword: '',
                groupId: user.groupId || 3,
                isActive: user.isActive !== undefined ? user.isActive : true
            });
        } else {
            // Create mode - reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                password: '',
                confirmPassword: '',
                groupId: 3,
                isActive: true
            });
        }
        setErrors({});
        setError('');
        setSuccess('');
    }, [user, isViewMode, open]);

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
        setFormData(prev => ({
            ...prev,
            [field]: event.target.checked
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (optional but if provided, must be valid)
        if (formData.phone && !/^\d{10,15}$/.test(String(formData.phone).replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        // Password validation (required for new users, optional for editing)
        if (!user) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        } else if (formData.password) {
            // Password is optional when editing, but if provided, validate it
            if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
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
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone ? parseInt(formData.phone.replace(/\s/g, '')) : null,
                address: formData.address.trim() || null,
                groupId: formData.groupId,
                isActive: formData.isActive
            };

            // Add password only if provided
            if (formData.password) {
                submitData.password = formData.password;
            }

            let result;
            if (user && !isViewMode) {
                // Update existing user
                result = await userAPI.updateUser(user.id, submitData);
            } else if (!user) {
                // Create new user
                result = await userAPI.createUser(submitData);
            } else {
                // View mode - no action needed
                setLoading(false);
                return;
            }

            if (result.success) {
                setSuccess(result.message || (user ? 'User updated successfully' : 'User created successfully'));
                setTimeout(() => {
                    onClose(true); // Refresh the user list
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

    const getGroupName = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        return group ? group.name : 'Unknown';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
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
        >
            <DialogTitle>
                <Typography variant="h5" component="div">
                    {isViewMode ? 'View User' : (user ? 'Edit User' : 'Create New User')}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {/* Alerts */}
                    {error && (
                        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {/* User Info Section */}
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        User Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={formData.name}
                                onChange={handleInputChange('name')}
                                error={!!errors.name}
                                helperText={errors.name}
                                disabled={isViewMode}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={isViewMode}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange('phone')}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                disabled={isViewMode}
                                placeholder="e.g., 1234567890"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>User Group</InputLabel>
                                <Select
                                    value={formData.groupId}
                                    onChange={handleInputChange('groupId')}
                                    disabled={isViewMode}
                                    label="User Group"
                                >
                                    {groups.map((group) => (
                                        <MenuItem key={group.id} value={group.id}>
                                            {group.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                multiline
                                rows={3}
                                value={formData.address}
                                onChange={handleInputChange('address')}
                                disabled={isViewMode}
                                placeholder="Enter full address"
                            />
                        </Grid>
                    </Grid>

                    {/* Password Section */}
                    {!isViewMode && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                Password {user ? '(Optional)' : '(Required)'}
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange('password')}
                                        error={!!errors.password}
                                        helperText={errors.password || (user ? 'Leave blank to keep current password' : 'Minimum 6 characters')}
                                        required={!user}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Confirm Password"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange('confirmPassword')}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        required={!user}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}

                    {/* Status Section */}
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        Account Status
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={handleSwitchChange('isActive')}
                                disabled={isViewMode}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>Active Account</Typography>
                                <Chip
                                    label={formData.isActive ? 'Active' : 'Inactive'}
                                    color={formData.isActive ? 'success' : 'default'}
                                    size="small"
                                />
                            </Box>
                        }
                    />

                    {/* VIP Toggle */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!!formData.isVip}
                                onChange={handleSwitchChange('isVip')}
                                disabled={isViewMode}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>VIP Member</Typography>
                                <Chip
                                    label={formData.isVip ? 'VIP' : 'Normal'}
                                    color={formData.isVip ? 'warning' : 'default'}
                                    size="small"
                                />
                            </Box>
                        }
                    />

                    {/* User Details (View Mode) */}
                    {isViewMode && user && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                Account Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        User ID
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Current Group
                                    </Typography>
                                    <Typography variant="body1">
                                        {getGroupName(user.groupId)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Created Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(user.created_at)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(user.updated_at)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    {isViewMode ? 'Close' : 'Cancel'}
                </Button>
                {!isViewMode && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default UserForm;
