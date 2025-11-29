import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider,
    Pagination,
    InputAdornment,
    Tooltip,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Category as CategoryIcon,
    Book as BookIcon,
    Person as PersonIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { typeAPI } from '../../../Util/Api';
import './ManageType.scss';

const ManageType = () => {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedType, setSelectedType] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // View mode states
    const [viewMode, setViewMode] = useState('list'); // 'list', 'ebooks', 'users'
    const [typeEbooks, setTypeEbooks] = useState([]);
    const [typeUsers, setTypeUsers] = useState([]);

    useEffect(() => {
        fetchTypes();
    }, [currentPage, searchTerm, filterActive]);

    const fetchTypes = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                page: currentPage,
                pageSize,
                search: searchTerm || undefined,
                isActive: filterActive ? true : undefined,
                sortBy: 'name',
                sortOrder: 'ASC'
            };

            const result = await typeAPI.getAllTypes(params);
            if (result.success && result.data?.DT) {
                setTypes(result.data.DT.types || []);
                setTotalPages(result.data.DT.pagination?.totalPages || 0);
                setTotalItems(result.data.DT.pagination?.totalItems || 0);
            } else {
                setError(result.message || 'Failed to fetch types');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    const handleFilterChange = (event) => {
        setFilterActive(event.target.checked);
        setCurrentPage(0);
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page - 1);
    };

    const openDialog = (mode, type = null) => {
        setDialogMode(mode);
        setSelectedType(type);
        setFormErrors({});

        if (mode === 'create') {
            setFormData({
                name: '',
                description: '',
                isActive: true
            });
        } else if (mode === 'edit' && type) {
            setFormData({
                name: type.name,
                description: type.description || '',
                isActive: type.isActive
            });
        } else if (mode === 'view' && type) {
            setFormData({
                name: type.name,
                description: type.description || '',
                isActive: type.isActive
            });
        }

        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setSelectedType(null);
        setFormData({
            name: '',
            description: '',
            isActive: true
        });
        setFormErrors({});
        setSubmitting(false);
    };

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSwitchChange = (field) => (event) => {
        const checked = event.target.checked;
        setFormData(prev => ({
            ...prev,
            [field]: checked
        }));
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Type name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Type name must be at least 2 characters';
        }

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            let result;
            if (dialogMode === 'create') {
                result = await typeAPI.createType({
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    isActive: formData.isActive
                });
            } else if (dialogMode === 'edit') {
                result = await typeAPI.updateType(selectedType.typeId, {
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    isActive: formData.isActive
                });
            }

            if (result.success) {
                setSuccess(result.message || 'Type saved successfully');
                closeDialog();
                fetchTypes();
            } else {
                setError(result.message || 'Operation failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (type) => {
        if (!window.confirm(`Are you sure you want to delete "${type.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const result = await typeAPI.deleteType(type.typeId);
            if (result.success) {
                setSuccess(result.message || 'Type deleted successfully');
                fetchTypes();
            } else {
                setError(result.message || 'Failed to delete type');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        }
    };

    const handleViewEbooks = async (type) => {
        setViewMode('ebooks');
        setSelectedType(type);
        setLoading(true);

        try {
            const result = await typeAPI.getEbooksByType(type.typeId, { pageSize: 50 });
            if (result.success && result.data?.DT?.ebooks) {
                setTypeEbooks(result.data.DT.ebooks);
            } else {
                setError(result.message || 'Failed to fetch ebooks');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleViewUsers = async (type) => {
        setViewMode('users');
        setSelectedType(type);
        setLoading(true);

        try {
            const result = await typeAPI.getUsersWhoFavouritedType(type.typeId);
            if (result.success && result.data?.DT) {
                setTypeUsers(result.data.DT);
            } else {
                setError(result.message || 'Failed to fetch users');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'success' : 'default';
    };

    const getStatusLabel = (isActive) => {
        return isActive ? 'Active' : 'Inactive';
    };

    const renderListView = () => (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Type Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => openDialog('create')}
                >
                    Add New Type
                </Button>
            </Box>

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

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search types..."
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={filterActive}
                                        onChange={handleFilterChange}
                                    />
                                }
                                label="Show only active types"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : types.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography color="text.secondary">
                                            No types found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                types.map((type) => (
                                    <TableRow key={type.typeId} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2">
                                                {type.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {type.description || 'No description'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusLabel(type.isActive)}
                                                color={getStatusColor(type.isActive)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(type.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View Ebooks">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewEbooks(type)}
                                                >
                                                    <BookIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View Users">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewUsers(type)}
                                                >
                                                    <PersonIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openDialog('view', type)}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openDialog('edit', type)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(type)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage + 1}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Card>
        </Box>
    );

    const renderEbooksView = () => (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => setViewMode('list')} sx={{ mr: 2 }}>
                    ←
                </IconButton>
                <Typography variant="h5">
                    Ebooks in "{selectedType?.name}"
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {typeEbooks.map((ebook) => (
                        <Grid item xs={12} sm={6} md={4} key={ebook.ebookId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {ebook.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {ebook.description || 'No description'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                        <Chip
                                            label={ebook.status}
                                            size="small"
                                            color={ebook.status === 'published' ? 'success' : 'default'}
                                        />
                                        <Chip
                                            label={`${ebook.viewCount || 0} views`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        By: {ebook.author?.name || 'Unknown'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {typeEbooks.length === 0 && (
                        <Grid item xs={12}>
                            <Typography color="text.secondary" align="center">
                                No ebooks found for this type
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );

    const renderUsersView = () => (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => setViewMode('list')} sx={{ mr: 2 }}>
                    ←
                </IconButton>
                <Typography variant="h5">
                    Users who favourited "{selectedType?.name}"
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {typeUsers.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        {user.avatar ? (
                                            <img
                                                src={`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/public${user.avatar}`}
                                                alt={user.name}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    marginRight: 12
                                                }}
                                            />
                                        ) : (
                                            <PersonIcon sx={{ mr: 1 }} />
                                        )}
                                        <Box>
                                            <Typography variant="subtitle1">
                                                {user.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {typeUsers.length === 0 && (
                        <Grid item xs={12}>
                            <Typography color="text.secondary" align="center">
                                No users have favourited this type
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );

    return (
        <Box sx={{ p: 3 }}>
            {viewMode === 'list' && renderListView()}
            {viewMode === 'ebooks' && renderEbooksView()}
            {viewMode === 'users' && renderUsersView()}

            {/* Create/Edit Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {dialogMode === 'create' ? 'Create New Type' :
                        dialogMode === 'edit' ? 'Edit Type' : 'View Type'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Type Name"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            disabled={dialogMode === 'view'}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange('description')}
                            disabled={dialogMode === 'view'}
                            placeholder="Enter a description for this type"
                            sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={handleSwitchChange('isActive')}
                                    disabled={dialogMode === 'view'}
                                />
                            }
                            label="Active"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>
                        {dialogMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                    {dialogMode !== 'view' && (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={20} /> : null}
                        >
                            {submitting ? 'Saving...' :
                                dialogMode === 'create' ? 'Create' : 'Update'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageType;
