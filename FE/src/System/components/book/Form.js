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
    Divider,
    Chip,
    Paper,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Book as BookIcon,
    Image as ImageIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { ebookAPI, userAPI, typeAPI } from '../../../Util/Api';

const EbookForm = ({ open, ebook, isViewMode = false, onClose }) => {
    const [formData, setFormData] = useState({
        authorId: '',
        title: '',
        description: '',
        status: 'draft',
        typeIds: []
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [loadingAuthors, setLoadingAuthors] = useState(false);
    const [types, setTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [uploadMode, setUploadMode] = useState(false); // true for PDF upload, false for manual creation

    useEffect(() => {
        if (open) {
            fetchAuthors();
            fetchTypes();
            if (ebook && !isViewMode) {
                // Edit mode - populate form with ebook data
                setFormData({
                    authorId: ebook.authorId || '',
                    title: ebook.title || '',
                    description: ebook.description || '',
                    status: ebook.status || 'draft',
                    typeIds: ebook.types ? ebook.types.map(type => type.typeId) : []
                });
                setUploadMode(false);
            } else if (ebook && isViewMode) {
                // View mode - populate form with ebook data (read-only)
                setFormData({
                    authorId: ebook.authorId || '',
                    title: ebook.title || '',
                    description: ebook.description || '',
                    status: ebook.status || 'draft',
                    typeIds: ebook.types ? ebook.types.map(type => type.typeId) : []
                });
                setUploadMode(false);
            } else {
                // Create mode - reset form
                setFormData({
                    authorId: '',
                    title: '',
                    description: '',
                    status: 'draft',
                    typeIds: []
                });
                setUploadMode(false);
            }
            setErrors({});
            setError('');
            setSuccess('');
            setSelectedFile(null);
            setSelectedCoverImage(null);
            setUploadProgress(0);
        }
    }, [ebook, isViewMode, open]);

    const fetchAuthors = async () => {
        setLoadingAuthors(true);
        try {
            const result = await userAPI.getAllUsers({ pageSize: 100 });
            if (result.success && result.data?.DT?.rows) {
                setAuthors(result.data.DT.rows);
            }
        } catch (err) {
            console.error('Failed to fetch authors:', err);
        } finally {
            setLoadingAuthors(false);
        }
    };

    const fetchTypes = async () => {
        setLoadingTypes(true);
        try {
            const result = await typeAPI.getAllTypes({ pageSize: 100, isActive: true });
            if (result.success && result.data?.DT?.types) {
                setTypes(result.data.DT.types);
            }
        } catch (err) {
            console.error('Failed to fetch types:', err);
        } finally {
            setLoadingTypes(false);
        }
    };

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

    const handleTypeChange = (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            typeIds: typeof value === 'string' ? value.split(',').map(id => parseInt(id)) : value
        }));

        // Clear error for types
        if (errors.typeIds) {
            setErrors(prev => ({
                ...prev,
                typeIds: ''
            }));
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError('Please select a PDF file');
                return;
            }
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                setError('File size must be less than 50MB');
                return;
            }
            setSelectedFile(file);
            setError('');
        }
    };

    const handleCoverImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
                setError('Cover image size must be less than 10MB');
                return;
            }
            setSelectedCoverImage(file);
            setError('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Author validation
        if (!formData.authorId) {
            newErrors.authorId = 'Author is required';
        }

        // Title validation
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        // Type validation
        if (!formData.typeIds || formData.typeIds.length === 0) {
            newErrors.typeIds = 'At least one type is required';
        } else if (formData.typeIds.length > 5) {
            newErrors.typeIds = 'Maximum 5 types allowed';
        }

        // PDF file validation for upload mode
        if (uploadMode && !ebook && !selectedFile) {
            newErrors.file = 'PDF file is required for upload';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        if (uploadMode && !ebook) {
            // PDF Upload mode
            await handleUpload();
        } else {
            // Manual create/edit mode
            await handleManualSave();
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress(0);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('pdfFile', selectedFile);
            if (selectedCoverImage) {
                formDataToSend.append('coverImage', selectedCoverImage);
            }
            formDataToSend.append('authorId', formData.authorId);
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('status', formData.status);

            const result = await ebookAPI.uploadEbook(formDataToSend);

            if (result.success) {
                setSuccess(result.message || 'Ebook uploaded and processed successfully!');
                setUploadProgress(100);
                setTimeout(() => {
                    onClose(true); // Refresh the ebook list
                }, 2000);
            } else {
                setError(result.message || 'Upload failed');
                setUploadProgress(0);
            }
        } catch (err) {
            setError('An unexpected error occurred during upload');
            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    };

    const handleManualSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitData = {
                authorId: formData.authorId,
                title: formData.title.trim(),
                description: formData.description.trim(),
                status: formData.status
            };

            let result;
            if (ebook && !isViewMode) {
                // Update existing ebook
                result = await ebookAPI.updateEbook(ebook.ebookId, submitData);

                // Update types separately
                if (result.success && formData.typeIds.length > 0) {
                    const typeResult = await typeAPI.addTypesToEbook(ebook.ebookId, formData.typeIds);
                    if (!typeResult.success) {
                        console.warn('Failed to update types:', typeResult.message);
                    }
                }
            } else if (!ebook) {
                // Create new ebook
                result = await ebookAPI.createEbook(submitData);

                // Add types to newly created ebook
                if (result.success && result.data?.DT?.ebookId && formData.typeIds.length > 0) {
                    const typeResult = await typeAPI.addTypesToEbook(result.data.DT.ebookId, formData.typeIds);
                    if (!typeResult.success) {
                        console.warn('Failed to add types to new ebook:', typeResult.message);
                    }
                }
            } else {
                // View mode - no action needed
                setLoading(false);
                return;
            }

            if (result.success) {
                setSuccess(result.message || (ebook ? 'Ebook updated successfully' : 'Ebook created successfully'));
                setTimeout(() => {
                    onClose(true); // Refresh the ebook list
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
        if (!loading && !uploading) {
            onClose();
        }
    };

    const getAuthorName = (authorId) => {
        const author = authors.find(a => a.id === authorId);
        return author ? author.name : 'Unknown';
    };

    const getCoverImageUrl = (coverImage) => {
        if (!coverImage) return null;
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        return `${baseUrl}/public${coverImage}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'success';
            case 'draft': return 'warning';
            case 'archived': return 'default';
            case 'pending_review': return 'info';
            default: return 'default';
        }
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
                    {isViewMode ? 'View Ebook' : (ebook ? 'Edit Ebook' : 'Create New Ebook')}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {/* Upload Progress */}
                    {uploading && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Uploading and processing PDF...
                            </Typography>
                            <LinearProgress
                                variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
                                value={uploadProgress}
                            />
                        </Box>
                    )}

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

                    {/* Creation Mode Toggle */}
                    {!ebook && !isViewMode && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                How would you like to create the ebook?
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            cursor: 'pointer',
                                            border: uploadMode ? '2px solid' : '1px solid',
                                            borderColor: uploadMode ? 'primary.main' : 'divider'
                                        }}
                                        onClick={() => setUploadMode(true)}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <UploadIcon sx={{ mr: 1 }} />
                                            <Typography variant="h6">Upload PDF</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Upload a PDF file and automatically generate pages
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            cursor: 'pointer',
                                            border: !uploadMode ? '2px solid' : '1px solid',
                                            borderColor: !uploadMode ? 'primary.main' : 'divider'
                                        }}
                                        onClick={() => setUploadMode(false)}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <BookIcon sx={{ mr: 1 }} />
                                            <Typography variant="h6">Manual Creation</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Create ebook manually and add pages later
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* PDF Upload Section */}
                    {uploadMode && !ebook && (
                        <>
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                Upload PDF File
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <input
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    id="pdf-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={isViewMode || uploading}
                                />
                                <label htmlFor="pdf-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<UploadIcon />}
                                        fullWidth
                                        sx={{ height: 60 }}
                                        disabled={isViewMode || uploading}
                                    >
                                        {selectedFile ? selectedFile.name : 'Choose PDF File'}
                                    </Button>
                                </label>
                                {errors.file && (
                                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                                        {errors.file}
                                    </Typography>
                                )}
                            </Box>

                            {/* Cover Image Upload */}
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                Cover Image (Optional)
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="cover-image-upload"
                                    type="file"
                                    onChange={handleCoverImageChange}
                                    disabled={isViewMode || uploading}
                                />
                                <label htmlFor="cover-image-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<ImageIcon />}
                                        fullWidth
                                        sx={{ height: 60 }}
                                        disabled={isViewMode || uploading}
                                    >
                                        {selectedCoverImage ? selectedCoverImage.name : 'Choose Cover Image'}
                                    </Button>
                                </label>
                                {selectedCoverImage && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <img
                                            src={URL.createObjectURL(selectedCoverImage)}
                                            alt="Cover preview"
                                            style={{
                                                maxWidth: '200px',
                                                maxHeight: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                        </>
                    )}

                    {/* Ebook Information Section */}
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        Ebook Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.authorId}>
                                <InputLabel>Author</InputLabel>
                                <Select
                                    value={formData.authorId}
                                    onChange={handleInputChange('authorId')}
                                    disabled={isViewMode || loadingAuthors}
                                    label="Author"
                                >
                                    {authors.map((author) => (
                                        <MenuItem key={author.id} value={author.id}>
                                            {author.name} ({author.email})
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.authorId && (
                                    <Typography color="error" variant="caption">
                                        {errors.authorId}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    onChange={handleInputChange('status')}
                                    disabled={isViewMode}
                                    label="Status"
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                    <MenuItem value="pending_review">Pending Review</MenuItem>
                                    <MenuItem value="archived">Archived</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={handleInputChange('title')}
                                error={!!errors.title}
                                helperText={errors.title}
                                disabled={isViewMode}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                disabled={isViewMode}
                                placeholder="Enter a brief description of the ebook"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.typeIds}>
                                <InputLabel>Types (1-5 required)</InputLabel>
                                <Select
                                    multiple
                                    value={formData.typeIds}
                                    onChange={handleTypeChange}
                                    disabled={isViewMode || loadingTypes}
                                    label="Types (1-5 required)"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const type = types.find(t => t.typeId === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={type ? type.name : `Type ${value}`}
                                                        size="small"
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {types.map((type) => (
                                        <MenuItem key={type.typeId} value={type.typeId}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.typeIds && (
                                    <Typography color="error" variant="caption">
                                        {errors.typeIds}
                                    </Typography>
                                )}
                                {!loadingTypes && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                        Selected: {formData.typeIds.length}/5 types
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Ebook Details (View Mode) */}
                    {isViewMode && ebook && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                Ebook Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Ebook ID
                                    </Typography>
                                    <Typography variant="body1">
                                        {ebook.ebookId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        View Count
                                    </Typography>
                                    <Typography variant="body1">
                                        {ebook.viewCount || 0} views
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Current Status
                                    </Typography>
                                    <Chip
                                        label={formData.status.replace('_', ' ').toUpperCase()}
                                        color={getStatusColor(formData.status)}
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Author
                                    </Typography>
                                    <Typography variant="body1">
                                        {getAuthorName(formData.authorId)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Created Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(ebook.createdAt)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(ebook.updatedAt)}
                                    </Typography>
                                </Grid>
                                {ebook.types && ebook.types.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Types
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {ebook.types.map((type) => (
                                                <Chip
                                                    key={type.typeId}
                                                    label={type.name}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                                {ebook.coverImage && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Cover Image
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <img
                                                src={getCoverImageUrl(ebook.coverImage)}
                                                alt="Cover"
                                                style={{
                                                    maxWidth: '200px',
                                                    maxHeight: '200px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>

                            {/* Pages Information */}
                            {ebook.pages && ebook.pages.length > 0 && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                        Pages ({ebook.pages.length})
                                    </Typography>
                                    <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                                        {ebook.pages.slice(0, 5).map((page) => (
                                            <ListItem key={page.pageId}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ImageIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={page.title || `Page ${page.pageNumber}`}
                                                    secondary={`Page ${page.pageNumber} • ${page.status}`}
                                                />
                                            </ListItem>
                                        ))}
                                        {ebook.pages.length > 5 && (
                                            <ListItem>
                                                <ListItemText
                                                    primary={`... and ${ebook.pages.length - 5} more pages`}
                                                    sx={{ textAlign: 'center', fontStyle: 'italic' }}
                                                />
                                            </ListItem>
                                        )}
                                    </List>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} disabled={loading || uploading}>
                    {isViewMode ? 'Close' : 'Cancel'}
                </Button>
                {!isViewMode && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || uploading}
                        startIcon={(loading || uploading) ? <CircularProgress size={20} /> : null}
                    >
                        {uploading ? 'Uploading...' : loading ? 'Saving...' :
                            (uploadMode && !ebook ? 'Upload & Process' :
                                ebook ? 'Update Ebook' : 'Create Ebook')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default EbookForm;

