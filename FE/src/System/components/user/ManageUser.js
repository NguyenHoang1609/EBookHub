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
    Switch,
    FormControlLabel,
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
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Visibility as ViewIcon,
    Block as BlockIcon,
    CheckCircle as ActiveIcon,
    Group as GroupIcon,
    PersonAdd as PersonAddIcon,
    Insights as InsightsIcon
} from '@mui/icons-material';
import { userAPI } from '../../../Util/Api';
import UserForm from './Form';
import './ManageUser.scss';

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [groups, setGroups] = useState([]);

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState('');

    // Mock groups data - in real app, you'd fetch this from API
    const mockGroups = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Moderator' },
        { id: 3, name: 'User' }
    ];

    useEffect(() => {
        setGroups(mockGroups);
        fetchUsers();
        fetchStats();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, page, rowsPerPage]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await userAPI.getAllUsers({
                page,
                pageSize: rowsPerPage,
                search: searchTerm || undefined
            });

            if (result.success) {
                setUsers(result.data.DT.rows || []);
                setTotalUsers(
                    result.data.DT.count ??
                    result.data.DT.pagination?.totalItems ??
                    (Array.isArray(result.data.DT.rows) ? result.data.DT.rows.length : 0)
                );
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        setStatsLoading(true);
        setStatsError('');
        try {
            const result = await userAPI.getUserStats();
            if (result.success) {
                setStats(result.data.DT);
            } else {
                setStatsError(result.message || 'Failed to fetch user statistics');
            }
        } catch (e) {
            setStatsError('Failed to fetch user statistics');
        } finally {
            setStatsLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
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
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateUser = () => {
        setEditingUser(null);
        setFormOpen(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormOpen(true);
    };

    const handleViewUser = (user) => {
        setViewingUser(user);
        setFormOpen(true);
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length > 0) {
            setBulkDeleteDialogOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setLoading(true);
        try {
            const result = await userAPI.deleteUser(userToDelete.id);
            if (result.success) {
                setSuccess('User deleted successfully');
                fetchUsers();
                fetchStats();
                setSelectedUsers(prev => prev.filter(id => id !== userToDelete.id));
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to delete user');
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    const confirmBulkDelete = async () => {
        setLoading(true);
        try {
            const result = await userAPI.bulkDeleteUsers(selectedUsers);
            if (result.success) {
                setSuccess(`${selectedUsers.length} users deleted successfully`);
                setSelectedUsers([]);
                fetchUsers();
                fetchStats();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to delete users');
        } finally {
            setLoading(false);
            setBulkDeleteDialogOpen(false);
        }
    };

    const handleFormClose = (refresh = false) => {
        setFormOpen(false);
        setEditingUser(null);
        setViewingUser(null);
        if (refresh) {
            fetchUsers();
            fetchStats();
        }
    };

    const getGroupName = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        return group ? group.name : 'Unknown';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Box className="manage-user-container">
            <Paper elevation={3} className="manage-user-paper">
                {/* Header */}
                <Box className="header-section">
                    <Typography variant="h4" component="h1" className="page-title">
                        User Management
                    </Typography>
                    <Box className="header-actions">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreateUser}
                            disabled={loading}
                        >
                            Add User
                        </Button>
                        {selectedUsers.length > 0 && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleBulkDelete}
                                disabled={loading}
                            >
                                Delete Selected ({selectedUsers.length})
                            </Button>
                        )}
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
                            <Paper className="stat-card stat-total" elevation={1}>
                                <Box className="stat-icon">
                                    <GroupIcon />
                                </Box>
                                <Box className="stat-content">
                                    <Typography className="stat-label">Total Users</Typography>
                                    <Typography className="stat-value">
                                        {statsLoading ? <CircularProgress size={20} /> : (stats?.totalUsers ?? 0)}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper className="stat-card stat-active" elevation={1}>
                                <Box className="stat-icon">
                                    <ActiveIcon />
                                </Box>
                                <Box className="stat-content">
                                    <Typography className="stat-label">Active</Typography>
                                    <Typography className="stat-value">
                                        {statsLoading ? <CircularProgress size={20} /> : (stats?.activeUsers ?? 0)}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper className="stat-card stat-inactive" elevation={1}>
                                <Box className="stat-icon">
                                    <BlockIcon />
                                </Box>
                                <Box className="stat-content">
                                    <Typography className="stat-label">Inactive</Typography>
                                    <Typography className="stat-value">
                                        {statsLoading ? <CircularProgress size={20} /> : (stats?.inactiveUsers ?? 0)}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper className="stat-card stat-recent" elevation={1}>
                                <Box className="stat-icon">
                                    <InsightsIcon />
                                </Box>
                                <Box className="stat-content">
                                    <Typography className="stat-label">New (7d)</Typography>
                                    <Typography className="stat-value">
                                        {statsLoading ? <CircularProgress size={20} /> : (stats?.recentUsers ?? 0)}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Search and Filters */}
                <Box className="search-section">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search users by name, email, phone, or address..."
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
                    <IconButton onClick={() => { fetchUsers(); fetchStats(); }} disabled={loading || statsLoading}>
                        <RefreshIcon />
                    </IconButton>
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

                {/* Users Table */}
                <TableContainer className="table-container">
                    {loading ? (
                        <Box className="loading-container">
                            <CircularProgress />
                            <Typography>Loading users...</Typography>
                        </Box>
                    ) : (
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                                            checked={users.length > 0 && selectedUsers.length === users.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Group</TableCell>
                                    <TableCell>VIP</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" className="user-name">
                                                {user.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone || '-'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getGroupName(user.groupId)}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.isVip ? 'VIP' : 'Normal'}
                                                color={user.isVip ? 'warning' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={user.isActive ? <ActiveIcon /> : <BlockIcon />}
                                                label={user.isActive ? 'Active' : 'Inactive'}
                                                color={user.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(user.created_at)}</TableCell>
                                        <TableCell align="center">
                                            <Box className="action-buttons">
                                                <Tooltip title="View User">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewUser(user)}
                                                        color="info"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit User">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditUser(user)}
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete User">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteUser(user)}
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
                    count={totalUsers}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    className="pagination"
                />
            </Paper>

            {/* User Form Dialog */}
            <UserForm
                open={formOpen}
                user={editingUser || viewingUser}
                isViewMode={!!viewingUser}
                groups={groups}
                onClose={handleFormClose}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog open={bulkDeleteDialogOpen} onClose={() => setBulkDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Bulk Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete {selectedUsers.length} selected users? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmBulkDelete} color="error" variant="contained">
                        Delete All
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageUser;
