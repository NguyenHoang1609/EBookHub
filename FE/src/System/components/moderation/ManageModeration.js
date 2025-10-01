import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Box,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    Tooltip,
    Menu,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Security as SecurityIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    FilterList as FilterIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Block as BlockIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { contentModerationAPI } from '../../../Util/Api';
import ModerationForm from './Form';
import './ManageModeration.scss';

const ManageModeration = () => {
    const [moderationWords, setModerationWords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState(true);
    const [selectedWords, setSelectedWords] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editingWord, setEditingWord] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedWordId, setSelectedWordId] = useState(null);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);

    useEffect(() => {
        fetchModerationWords();
        fetchStats();
    }, [page, rowsPerPage, searchTerm, severityFilter, categoryFilter, statusFilter]);

    const fetchModerationWords = async () => {
        setLoading(true);
        try {
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                search: searchTerm,
                severity: severityFilter,
                category: categoryFilter,
                isActive: statusFilter
            };

            const result = await contentModerationAPI.getAllModerationWords(params);
            if (result.success) {
                setModerationWords(result.data.DT.moderationWords);
                setTotalItems(result.data.DT.pagination.totalItems);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch moderation words');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const result = await contentModerationAPI.getModerationStats();
            if (result.success) {
                setStats(result.data.DT);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleFilterChange = (filterType, value) => {
        switch (filterType) {
            case 'severity':
                setSeverityFilter(value);
                break;
            case 'category':
                setCategoryFilter(value);
                break;
            case 'status':
                setStatusFilter(value);
                break;
            default:
                break;
        }
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
            setSelectedWords(moderationWords.map(word => word.moderationId));
        } else {
            setSelectedWords([]);
        }
    };

    const handleSelectWord = (wordId) => {
        setSelectedWords(prev =>
            prev.includes(wordId)
                ? prev.filter(id => id !== wordId)
                : [...prev, wordId]
        );
    };

    const handleMenuOpen = (event, wordId) => {
        setAnchorEl(event.currentTarget);
        setSelectedWordId(wordId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedWordId(null);
    };

    const handleEdit = () => {
        const word = moderationWords.find(w => w.moderationId === selectedWordId);
        setEditingWord(word);
        setFormOpen(true);
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selectedWordId) {
            try {
                const result = await contentModerationAPI.deleteModerationWord(selectedWordId);
                if (result.success) {
                    setSuccess('Moderation word deleted successfully');
                    fetchModerationWords();
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Failed to delete moderation word');
            }
        }
        handleMenuClose();
    };

    const handleBulkDelete = async () => {
        if (selectedWords.length === 0) return;

        try {
            const result = await contentModerationAPI.bulkDeleteModerationWords(selectedWords);
            if (result.success) {
                setSuccess(result.message);
                setSelectedWords([]);
                fetchModerationWords();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to delete moderation words');
        }
    };

    const handleFormClose = (refresh = false) => {
        setFormOpen(false);
        setEditingWord(null);
        if (refresh) {
            fetchModerationWords();
            fetchStats();
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
        <div className="manage-moderation-container">
            <Paper className="manage-moderation-paper">
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-content">
                        <Typography variant="h4" className="page-title">
                            Content Moderation Management
                        </Typography>
                        <Typography variant="body1" className="page-subtitle">
                            Manage inappropriate words and content filtering
                        </Typography>
                    </div>
                    <div className="header-actions">
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchModerationWords}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setFormOpen(true)}
                        >
                            Add Word
                        </Button>
                    </div>
                </div>

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

                {/* Stats Section */}
                {stats && (
                    <div className="stats-section">
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card className="stat-card stat-total">
                                    <CardContent className="stat-content">
                                        <div className="stat-icon">
                                            <SecurityIcon />
                                        </div>
                                        <div className="stat-info">
                                            <Typography className="stat-label">Total Words</Typography>
                                            <Typography className="stat-value">{stats.totalWords}</Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card className="stat-card stat-active">
                                    <CardContent className="stat-content">
                                        <div className="stat-icon">
                                            <CheckCircleIcon />
                                        </div>
                                        <div className="stat-info">
                                            <Typography className="stat-label">Active Words</Typography>
                                            <Typography className="stat-value">{stats.activeWords}</Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card className="stat-card stat-inactive">
                                    <CardContent className="stat-content">
                                        <div className="stat-icon">
                                            <CancelIcon />
                                        </div>
                                        <div className="stat-info">
                                            <Typography className="stat-label">Inactive Words</Typography>
                                            <Typography className="stat-value">{stats.inactiveWords}</Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card className="stat-card stat-critical">
                                    <CardContent className="stat-content">
                                        <div className="stat-icon">
                                            <WarningIcon />
                                        </div>
                                        <div className="stat-info">
                                            <Typography className="stat-label">Critical Words</Typography>
                                            <Typography className="stat-value">{stats.severityBreakdown.critical || 0}</Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                )}

                {/* Search and Filter Section */}
                <div className="search-section">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search words..."
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                                className="search-field"
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Severity</InputLabel>
                                <Select
                                    value={severityFilter}
                                    onChange={(e) => handleFilterChange('severity', e.target.value)}
                                    label="Severity"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                    <MenuItem value="critical">Critical</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={categoryFilter}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    label="Category"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="profanity">Profanity</MenuItem>
                                    <MenuItem value="violence">Violence</MenuItem>
                                    <MenuItem value="hate_speech">Hate Speech</MenuItem>
                                    <MenuItem value="sexual">Sexual</MenuItem>
                                    <MenuItem value="spam">Spam</MenuItem>
                                    <MenuItem value="political">Political</MenuItem>
                                    <MenuItem value="religious">Religious</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="true">Active</MenuItem>
                                    <MenuItem value="false">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => {
                                    setSearchTerm('');
                                    setSeverityFilter('');
                                    setCategoryFilter('');
                                    setStatusFilter('');
                                    setPage(0);
                                }}
                                fullWidth
                            >
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </div>

                {/* Bulk Actions */}
                {selectedWords.length > 0 && (
                    <div className="bulk-actions">
                        <Typography variant="body2" sx={{ mr: 2 }}>
                            {selectedWords.length} word(s) selected
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleBulkDelete}
                        >
                            Delete Selected
                        </Button>
                    </div>
                )}

                {/* Table Section */}
                <div className="table-container">
                    {loading ? (
                        <div className="loading-container">
                            <CircularProgress />
                            <Typography>Loading moderation words...</Typography>
                        </div>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={selectedWords.length > 0 && selectedWords.length < moderationWords.length}
                                                    checked={moderationWords.length > 0 && selectedWords.length === moderationWords.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </TableCell>
                                            <TableCell>Word</TableCell>
                                            <TableCell>Severity</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Language</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Created By</TableCell>
                                            <TableCell>Created Date</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {moderationWords.map((word) => (
                                            <TableRow key={word.moderationId} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedWords.includes(word.moderationId)}
                                                        onChange={() => handleSelectWord(word.moderationId)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" className="word-text">
                                                        {word.word}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={word.severity}
                                                        color={getSeverityColor(word.severity)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={formatCategory(word.category)}
                                                        color={getCategoryColor(word.category)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {word.language.toUpperCase()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={word.isActive ? <CheckIcon /> : <BlockIcon />}
                                                        label={word.isActive ? 'Active' : 'Inactive'}
                                                        color={word.isActive ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {word.creator?.name || 'System'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {new Date(word.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        onClick={(e) => handleMenuOpen(e, word.moderationId)}
                                                        size="small"
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                component="div"
                                count={totalItems}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                className="pagination"
                            />
                        </>
                    )}
                </div>
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {/* Form Dialog */}
            <ModerationForm
                open={formOpen}
                moderationWord={editingWord}
                onClose={handleFormClose}
            />
        </div>
    );
};

export default ManageModeration;
