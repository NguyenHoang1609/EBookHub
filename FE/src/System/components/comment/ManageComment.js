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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    Collapse,
    Badge
} from '@mui/material';
import {
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    VisibilityOff as HideIcon,
    Reply as ReplyIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Block as BlockIcon,
    CheckCircle as ApproveIcon,
    FilterList as FilterIcon,
    Comment as CommentIcon,
    Book as BookIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { commentAPI, ebookAPI } from '../../../Util/Api';
import './ManageComment.scss';

const ManageComment = () => {
    // State management
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalComments, setTotalComments] = useState(0);

    // Filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ebookFilter, setEbookFilter] = useState('all');
    const [ebooks, setEbooks] = useState([]);

    // Dialog states
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    // Expanded replies state
    const [expandedReplies, setExpandedReplies] = useState(new Set());

    // Statistics
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        topLevel: 0,
        replies: 0
    });

    // Fetch comments with filters
    const fetchComments = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page: page + 1,
                limit: rowsPerPage,
                search: searchTerm,
                status: statusFilter,
                ebookId: ebookFilter !== 'all' ? ebookFilter : undefined
            };

            const result = await commentAPI.getAllComments(params);

            if (result.success) {
                setComments(result.data.DT.comments || []);
                setTotalComments(result.data.DT.pagination?.totalComments || 0);

                // Update stats
                setStats(prev => ({
                    ...prev,
                    total: result.data.DT.pagination?.totalComments || 0,
                    active: result.data.DT.stats?.active || 0,
                    inactive: result.data.DT.stats?.inactive || 0,
                    topLevel: result.data.DT.stats?.topLevel || 0,
                    replies: result.data.DT.stats?.replies || 0
                }));
            } else {
                setError(result.message || 'Failed to fetch comments');
            }
        } catch (err) {
            setError('Failed to fetch comments');
            console.error('Fetch comments error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch ebooks for filter
    const fetchEbooks = async () => {
        try {
            const result = await ebookAPI.getAllEbooks({ limit: 1000 });
            if (result.success) {
                setEbooks(result.data.DT.ebooks || []);
            }
        } catch (err) {
            console.error('Fetch ebooks error:', err);
        }
    };

    // Initialize data
    useEffect(() => {
        fetchEbooks();
    }, []);

    useEffect(() => {
        fetchComments();
    }, [page, rowsPerPage, searchTerm, statusFilter, ebookFilter]);

    // Handle comment deletion
    const handleDeleteComment = async (commentId) => {
        try {
            setLoading(true);
            const result = await commentAPI.deleteComment(commentId);

            if (result.success) {
                setSuccess('Comment deleted successfully');
                fetchComments();
                setDeleteDialogOpen(false);
                setCommentToDelete(null);
            } else {
                setError(result.message || 'Failed to delete comment');
            }
        } catch (err) {
            setError('Failed to delete comment');
            console.error('Delete comment error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle comment status toggle
    const handleToggleStatus = async (commentId, currentStatus) => {
        try {
            setLoading(true);
            const result = await commentAPI.toggleCommentStatus(commentId, !currentStatus);

            if (result.success) {
                setSuccess(`Comment ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
                fetchComments();
            } else {
                setError(result.message || 'Failed to update comment status');
            }
        } catch (err) {
            setError('Failed to update comment status');
            console.error('Toggle status error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle view comment details
    const handleViewComment = (comment) => {
        setSelectedComment(comment);
        setViewDialogOpen(true);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle search
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    // Toggle reply expansion
    const toggleRepliesExpansion = (commentId) => {
        const newExpanded = new Set(expandedReplies);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);
        }
        setExpandedReplies(newExpanded);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    // Get avatar URL
    const getAvatarUrl = (avatar) => {
        if (avatar) {
            return `http://localhost:8080/public${avatar}`;
        }
        return null;
    };

    // Mask user name
    const maskUserName = (name) => {
        if (!name || name.length <= 3) return name;
        const firstPart = name.substring(0, 3);
        const masked = '*'.repeat(Math.min(name.length - 3, 6));
        return firstPart + masked;
    };

    return (
        <Box className="manage-comments">
            {/* Header Section */}
            <Box className="comments-header">
                <Typography variant="h4" className="page-title">
                    <CommentIcon /> Manage Comments
                </Typography>

                {/* Statistics Cards */}
                <Grid container spacing={2} className="stats-grid">
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card className="stat-card total">
                            <CardContent>
                                <Typography variant="h6">{stats.total}</Typography>
                                <Typography variant="body2">Total Comments</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card className="stat-card active">
                            <CardContent>
                                <Typography variant="h6">{stats.active}</Typography>
                                <Typography variant="body2">Active</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card className="stat-card inactive">
                            <CardContent>
                                <Typography variant="h6">{stats.inactive}</Typography>
                                <Typography variant="body2">Inactive</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card className="stat-card top-level">
                            <CardContent>
                                <Typography variant="h6">{stats.topLevel}</Typography>
                                <Typography variant="body2">Main Comments</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <Card className="stat-card replies">
                            <CardContent>
                                <Typography variant="h6">{stats.replies}</Typography>
                                <Typography variant="body2">Replies</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Filters and Search */}
            <Paper className="filters-section">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search comments..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Book</InputLabel>
                            <Select
                                value={ebookFilter}
                                onChange={(e) => setEbookFilter(e.target.value)}
                                label="Book"
                            >
                                <MenuItem value="all">All Books</MenuItem>
                                {ebooks.map((ebook) => (
                                    <MenuItem key={ebook.ebookId} value={ebook.ebookId}>
                                        {ebook.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Button
                            variant="outlined"
                            onClick={fetchComments}
                            startIcon={<RefreshIcon />}
                            disabled={loading}
                            fullWidth
                        >
                            Refresh
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

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

            {/* Comments Table */}
            <Paper className="comments-table-container">
                {loading && (
                    <Box className="loading-overlay">
                        <CircularProgress />
                    </Box>
                )}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Comment</TableCell>
                                <TableCell>Book</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {comments.map((comment) => (
                                <React.Fragment key={comment.id}>
                                    <TableRow className={`comment-row ${!comment.isActive ? 'inactive' : ''}`}>
                                        <TableCell>
                                            <Box className="user-info">
                                                <Avatar
                                                    src={getAvatarUrl(comment.user?.avatar)}
                                                    className="user-avatar"
                                                >
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" className="user-name">
                                                        {maskUserName(comment.user?.name)}
                                                    </Typography>
                                                    <Typography variant="caption" className="user-id">
                                                        ID: {comment.userId}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Box className="comment-content">
                                                <Typography variant="body2" className="comment-text">
                                                    {comment.content.length > 100
                                                        ? `${comment.content.substring(0, 100)}...`
                                                        : comment.content
                                                    }
                                                </Typography>
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <Box className="replies-indicator">
                                                        <Badge badgeContent={comment.replies.length} color="primary">
                                                            <ReplyIcon fontSize="small" />
                                                        </Badge>
                                                        <Typography variant="caption">
                                                            {comment.replies.length} replies
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Box className="book-info">
                                                <BookIcon fontSize="small" />
                                                <Typography variant="body2">
                                                    {comment.ebook?.title || 'Unknown'}
                                                </Typography>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={comment.parentCommentId ? 'Reply' : 'Comment'}
                                                color={comment.parentCommentId ? 'secondary' : 'primary'}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(comment.created_at)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={comment.isActive ? 'Active' : 'Inactive'}
                                                color={comment.isActive ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Box className="action-buttons">
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        onClick={() => handleViewComment(comment)}
                                                        size="small"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title={comment.isActive ? 'Deactivate' : 'Activate'}>
                                                    <IconButton
                                                        onClick={() => handleToggleStatus(comment.id, comment.isActive)}
                                                        size="small"
                                                        color={comment.isActive ? 'warning' : 'success'}
                                                    >
                                                        {comment.isActive ? <BlockIcon /> : <ApproveIcon />}
                                                    </IconButton>
                                                </Tooltip>

                                                {comment.replies && comment.replies.length > 0 && (
                                                    <Tooltip title="View Replies">
                                                        <IconButton
                                                            onClick={() => toggleRepliesExpansion(comment.id)}
                                                            size="small"
                                                        >
                                                            {expandedReplies.has(comment.id) ?
                                                                <ExpandLessIcon /> : <ExpandMoreIcon />
                                                            }
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => {
                                                            setCommentToDelete(comment);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                        size="small"
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>

                                    {/* Replies Section */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="replies-cell">
                                                <Collapse in={expandedReplies.has(comment.id)}>
                                                    <Box className="replies-container">
                                                        <Typography variant="subtitle2" className="replies-title">
                                                            Replies ({comment.replies.length})
                                                        </Typography>
                                                        {comment.replies.map((reply) => (
                                                            <Box key={reply.id} className="reply-item">
                                                                <Box className="reply-user">
                                                                    <Avatar
                                                                        src={getAvatarUrl(reply.user?.avatar)}
                                                                        size="small"
                                                                    >
                                                                        <PersonIcon />
                                                                    </Avatar>
                                                                    <Typography variant="body2">
                                                                        {maskUserName(reply.user?.name)}
                                                                    </Typography>
                                                                    <Typography variant="caption">
                                                                        {formatDate(reply.created_at)}
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="body2" className="reply-content">
                                                                    {reply.content}
                                                                </Typography>
                                                                <Box className="reply-actions">
                                                                    <Chip
                                                                        label={reply.isActive ? 'Active' : 'Inactive'}
                                                                        color={reply.isActive ? 'success' : 'error'}
                                                                        size="small"
                                                                    />
                                                                    <IconButton
                                                                        onClick={() => handleToggleStatus(reply.id, reply.isActive)}
                                                                        size="small"
                                                                        color={reply.isActive ? 'warning' : 'success'}
                                                                    >
                                                                        {reply.isActive ? <BlockIcon /> : <ApproveIcon />}
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            setCommentToDelete(reply);
                                                                            setDeleteDialogOpen(true);
                                                                        }}
                                                                        size="small"
                                                                        color="error"
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}

                            {comments.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" className="no-data">
                                        <Typography variant="body1">
                                            No comments found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={totalComments}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Paper>

            {/* View Comment Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
                className="view-dialog"
            >
                <DialogTitle>
                    Comment Details
                </DialogTitle>
                <DialogContent>
                    {selectedComment && (
                        <Box className="comment-details">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">User Information</Typography>
                                    <Box className="detail-item">
                                        <Avatar src={getAvatarUrl(selectedComment.user?.avatar)}>
                                            <PersonIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1">
                                                {maskUserName(selectedComment.user?.name)}
                                            </Typography>
                                            <Typography variant="caption">
                                                User ID: {selectedComment.userId}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">Book Information</Typography>
                                    <Box className="detail-item">
                                        <BookIcon />
                                        <Typography variant="body1">
                                            {selectedComment.ebook?.title || 'Unknown'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">Comment Content</Typography>
                                    <Paper className="comment-content-detail">
                                        <Typography variant="body1">
                                            {selectedComment.content}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">Created</Typography>
                                    <Typography variant="body2">
                                        {formatDate(selectedComment.created_at)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2">Status</Typography>
                                    <Chip
                                        label={selectedComment.isActive ? 'Active' : 'Inactive'}
                                        color={selectedComment.isActive ? 'success' : 'error'}
                                    />
                                </Grid>

                                {selectedComment.replies && selectedComment.replies.length > 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">
                                            Replies ({selectedComment.replies.length})
                                        </Typography>
                                        <Box className="replies-detail">
                                            {selectedComment.replies.map((reply) => (
                                                <Paper key={reply.id} className="reply-detail-item">
                                                    <Box className="reply-header">
                                                        <Avatar src={getAvatarUrl(reply.user?.avatar)} size="small">
                                                            <PersonIcon />
                                                        </Avatar>
                                                        <Typography variant="body2">
                                                            {maskUserName(reply.user?.name)}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {formatDate(reply.created_at)}
                                                        </Typography>
                                                        <Chip
                                                            label={reply.isActive ? 'Active' : 'Inactive'}
                                                            color={reply.isActive ? 'success' : 'error'}
                                                            size="small"
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" className="reply-text">
                                                        {reply.content}
                                                    </Typography>
                                                </Paper>
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                className="delete-dialog"
            >
                <DialogTitle>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this comment? This action cannot be undone.
                        {commentToDelete?.replies?.length > 0 && (
                            <span className="warning-text">
                                <br />Warning: This will also delete {commentToDelete.replies.length} replies.
                            </span>
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDeleteComment(commentToDelete?.id)}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageComment;
