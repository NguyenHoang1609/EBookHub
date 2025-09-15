import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Chip,
    Typography,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Avatar,
    Card,
    CardContent
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Visibility as ViewIcon,
    Book as BookIcon,
    Person as PersonIcon,
    Visibility as VisibilityIcon,
    LibraryBooks as LibraryBooksIcon,
    Pages as PagesIcon
} from '@mui/icons-material';
import { ebookAPI, userAPI } from '../../../Util/Api';
import EbookForm from './Form';
import './ManageEbook.scss';

const ManageEbook = () => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalEbooks, setTotalEbooks] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
    const [selectedEbooks, setSelectedEbooks] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editingEbook, setEditingEbook] = useState(null);
    const [viewingEbook, setViewingEbook] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ebookToDelete, setEbookToDelete] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState('');

    useEffect(() => {
        fetchEbooks();
        fetchStats();
        fetchAuthors();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEbooks();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, authorFilter, page, rowsPerPage]);

    const fetchEbooks = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await ebookAPI.getAllEbooks({
                page: page + 1,
                limit: rowsPerPage,
                search: searchTerm || undefined,
                status: statusFilter || undefined,
                authorId: authorFilter || undefined
            });

            if (result.success) {
                const data = result.data.DT;
                setEbooks(data.ebooks || []);
                setTotalEbooks(data.pagination?.totalItems || 0);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch ebooks');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        setStatsLoading(true);
        setStatsError('');
        try {
            const result = await ebookAPI.getEbookStats();
            if (result.success) {
                setStats(result.data.DT);
            } else {
                setStatsError(result.message || 'Failed to fetch ebook statistics');
            }
        } catch (e) {
            setStatsError('Failed to fetch ebook statistics');
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchAuthors = async () => {
        try {
            const result = await userAPI.getAllUsers({ pageSize: 100 });
            if (result.success && result.data?.DT?.rows) {
                setAuthors(result.data.DT.rows);
            }
        } catch (err) {
            console.error('Failed to fetch authors:', err);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setPage(0);
    };

    const handleAuthorFilterChange = (event) => {
        setAuthorFilter(event.target.value);
        setPage(0);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedEbooks(ebooks.map(ebook => ebook.ebookId));
        } else {
            setSelectedEbooks([]);
        }
    };

    const handleSelectEbook = (ebookId) => {
        setSelectedEbooks(prev =>
            prev.includes(ebookId)
                ? prev.filter(id => id !== ebookId)
                : [...prev, ebookId]
        );
    };

    const handleCreateEbook = () => {
        setEditingEbook(null);
        setFormOpen(true);
    };

    const handleEditEbook = (ebook) => {
        setEditingEbook(ebook);
        setFormOpen(true);
    };

    const handleViewEbook = async (ebook) => {
        setLoading(true);
        try {
            const result = await ebookAPI.getEbookById(ebook.ebookId, true);
            if (result.success) {
                setViewingEbook(result.data.DT);
                setFormOpen(true);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch ebook details');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEbook = (ebook) => {
        setEbookToDelete(ebook);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!ebookToDelete) return;

        setLoading(true);
        try {
            const result = await ebookAPI.deleteEbook(ebookToDelete.ebookId);
            if (result.success) {
                setSuccess('Ebook deleted successfully');
                fetchEbooks();
                fetchStats();
                setSelectedEbooks(prev => prev.filter(id => id !== ebookToDelete.ebookId));
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to delete ebook');
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setEbookToDelete(null);
        }
    };

    const handleFormClose = (refresh = false) => {
        setFormOpen(false);
        setEditingEbook(null);
        setViewingEbook(null);
        if (refresh) {
            fetchEbooks();
            fetchStats();
        }
    };

    const getAuthorName = (authorId) => {
        const author = authors.find(a => a.id === authorId);
        return author ? author.name : 'Unknown';
    };

    const getCoverImageUrl = (coverImage) => {

        if (!coverImage) return null;
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        return `${baseUrl}/public/${coverImage}`;
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Box className="manage-ebook-container">
            <Paper elevation={3} className="manage-ebook-paper">
                {/* Header */}
                <Box className="header-section">
                    <Typography variant="h4" component="h1" className="page-title">
                        Ebook Management
                    </Typography>
                    <Box className="header-actions">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreateEbook}
                            disabled={loading}
                        >
                            Add Ebook
                        </Button>
                    </Box>
                </Box>

                {/* Stats Section */}
                <Box className="stats-section">
                    {statsError && (
                        <Alert severity="error" className="alert" onClose={() => setStatsError('')}>
                            {statsError}
                        </Alert>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="stat-card stat-total" elevation={1}>
                                <CardContent>
                                    <Box className="stat-content">
                                        <Box className="stat-icon">
                                            <LibraryBooksIcon />
                                        </Box>
                                        <Box>
                                            <Typography className="stat-label">Total Ebooks</Typography>
                                            <Typography className="stat-value">
                                                {statsLoading ? <CircularProgress size={20} /> : (stats?.totalEbooks ?? 0)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="stat-card stat-published" elevation={1}>
                                <CardContent>
                                    <Box className="stat-content">
                                        <Box className="stat-icon">
                                            <BookIcon />
                                        </Box>
                                        <Box>
                                            <Typography className="stat-label">Published</Typography>
                                            <Typography className="stat-value">
                                                {statsLoading ? <CircularProgress size={20} /> : (stats?.statusBreakdown?.published ?? 0)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="stat-card stat-views" elevation={1}>
                                <CardContent>
                                    <Box className="stat-content">
                                        <Box className="stat-icon">
                                            <VisibilityIcon />
                                        </Box>
                                        <Box>
                                            <Typography className="stat-label">Total Views</Typography>
                                            <Typography className="stat-value">
                                                {statsLoading ? <CircularProgress size={20} /> : (stats?.totalViews ?? 0)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="stat-card stat-pages" elevation={1}>
                                <CardContent>
                                    <Box className="stat-content">
                                        <Box className="stat-icon">
                                            <PagesIcon />
                                        </Box>
                                        <Box>
                                            <Typography className="stat-label">Total Pages</Typography>
                                            <Typography className="stat-value">
                                                {statsLoading ? <CircularProgress size={20} /> : (stats?.totalPages ?? 0)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Search and Filters */}
                <Box className="search-section">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search ebooks by title or description..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                className="search-field"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                    label="Status"
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                    <MenuItem value="pending_review">Pending Review</MenuItem>
                                    <MenuItem value="archived">Archived</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Author</InputLabel>
                                <Select
                                    value={authorFilter}
                                    onChange={handleAuthorFilterChange}
                                    label="Author"
                                >
                                    <MenuItem value="">All Authors</MenuItem>
                                    {authors.map((author) => (
                                        <MenuItem key={author.id} value={author.id}>
                                            {author.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <IconButton onClick={() => { fetchEbooks(); fetchStats(); }} disabled={loading || statsLoading}>
                                <RefreshIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>

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

                {/* Ebooks Table */}
                <TableContainer className="table-container">
                    {loading ? (
                        <Box className="loading-container">
                            <CircularProgress />
                            <Typography>Loading ebooks...</Typography>
                        </Box>
                    ) : (
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selectedEbooks.length > 0 && selectedEbooks.length < ebooks.length}
                                            checked={ebooks.length > 0 && selectedEbooks.length === ebooks.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Ebook</TableCell>
                                    <TableCell>Author</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Views</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ebooks.map((ebook) => (
                                    <TableRow key={ebook.ebookId} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedEbooks.includes(ebook.ebookId)}
                                                onChange={() => handleSelectEbook(ebook.ebookId)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box className="ebook-info">
                                                <Avatar
                                                    sx={{
                                                        mr: 2,
                                                        width: 56,
                                                        height: 56,
                                                        bgcolor: 'primary.main'
                                                    }}
                                                    src={getCoverImageUrl(ebook.coverImage)}
                                                    alt={ebook.title}
                                                >
                                                    <BookIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" className="ebook-title">
                                                        {ebook.title}
                                                    </Typography>
                                                    {ebook.description && (
                                                        <Typography variant="caption" color="text.secondary" noWrap>
                                                            {ebook.description.substring(0, 50)}
                                                            {ebook.description.length > 50 ? '...' : ''}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="author-info">
                                                <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {getAuthorName(ebook.authorId)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={ebook.status.replace('_', ' ').toUpperCase()}
                                                color={getStatusColor(ebook.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box className="views-info">
                                                <VisibilityIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {ebook.viewCount || 0}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{formatDate(ebook.createdAt)}</TableCell>
                                        <TableCell align="center">
                                            <Box className="action-buttons">
                                                <Tooltip title="View Ebook">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewEbook(ebook)}
                                                        color="info"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Ebook">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditEbook(ebook)}
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Ebook">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteEbook(ebook)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={totalEbooks}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    className="pagination"
                />
            </Paper>

            {/* Ebook Form Dialog */}
            <EbookForm
                open={formOpen}
                ebook={editingEbook || viewingEbook}
                isViewMode={!!viewingEbook}
                onClose={handleFormClose}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete ebook "{ebookToDelete?.title}"?
                        This will also delete all associated pages and files. This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageEbook;
