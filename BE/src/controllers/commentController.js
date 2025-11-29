import commentService from '../serivces/commentService';

const commentController = {
    // Get all comments for an ebook
    getCommentsByEbook: async (req, res) => {
        try {
            const { ebookId } = req.params;
            const { page = 1, limit = 20, sortBy = 'createdAt', order = 'DESC' } = req.query;

            const result = await commentService.getCommentsByEbook({
                ebookId: parseInt(ebookId),
                page: parseInt(page),
                limit: parseInt(limit),
                sortBy,
                order
            });

            return res.status(200).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Get comments error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    // Create a new comment
    createComment: async (req, res) => {
        try {
            const { userData, ebookId, content, parentCommentId = null } = req.body;
            const userId = userData?.id; // Assuming user ID comes from JWT middleware
            console.log(req.body)
            if (!userId) {
                return res.status(401).json({
                    EM: 'User not authenticated',
                    EC: 1,
                    DT: null
                });
            }

            if (!ebookId || !content) {
                return res.status(400).json({
                    EM: 'Ebook ID and content are required',
                    EC: 1,
                    DT: null
                });
            }

            const result = await commentService.createComment({
                userId: parseInt(userId),
                ebookId: parseInt(ebookId),
                content: content.trim(),
                parentCommentId: parentCommentId ? parseInt(parentCommentId) : null
            });

            return res.status(result.success ? 201 : 400).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Create comment error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    // Update a comment
    updateComment: async (req, res) => {
        try {
            const { userId, commentId, } = req.params;

            const { content } = req.body;


            if (!userId) {
                return res.status(401).json({
                    EM: 'User not authenticated',
                    EC: 1,
                    DT: null
                });
            }

            if (!content) {
                return res.status(400).json({
                    EM: 'Content is required',
                    EC: 1,
                    DT: null
                });
            }

            const result = await commentService.updateComment({
                commentId: parseInt(commentId),
                userId: parseInt(userId),
                content: content.trim()
            });

            return res.status(result.success ? 200 : 400).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Update comment error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    // Delete a comment
    deleteComment: async (req, res) => {
        try {
            const { userId, commentId } = req.params;


            if (!userId) {
                return res.status(401).json({
                    EM: 'User not authenticated',
                    EC: 1,
                    DT: null
                });
            }

            const result = await commentService.deleteComment({
                commentId: parseInt(commentId),
                userId: parseInt(userId)
            });

            return res.status(result.success ? 200 : 400).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Delete comment error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    // Get comment statistics for an ebook
    getCommentStats: async (req, res) => {
        try {
            const { ebookId } = req.params;

            const result = await commentService.getCommentStats({
                ebookId: parseInt(ebookId)
            });

            return res.status(200).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Get comment stats error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    // Admin-specific methods
    getAllCommentsForAdmin: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 20,
                search = '',
                status = 'all',
                ebookId,
                sortBy = 'created_at',
                order = 'DESC'
            } = req.query;

            const result = await commentService.getAllCommentsForAdmin({
                page: parseInt(page),
                limit: parseInt(limit),
                search: search.trim(),
                status,
                ebookId: ebookId ? parseInt(ebookId) : null,
                sortBy,
                order
            });

            return res.status(200).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Get all comments for admin error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    getCommentStatistics: async (req, res) => {
        try {
            const result = await commentService.getCommentStatistics();

            return res.status(200).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Get comment statistics error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    getCommentsByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 20, status = 'all' } = req.query;

            const result = await commentService.getCommentsByUser({
                userId: parseInt(userId),
                page: parseInt(page),
                limit: parseInt(limit),
                status
            });

            return res.status(200).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Get comments by user error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    toggleCommentStatus: async (req, res) => {
        try {
            const { commentId } = req.params;
            const { isActive } = req.body;

            const result = await commentService.toggleCommentStatus({
                commentId: parseInt(commentId),
                isActive: Boolean(isActive)
            });

            return res.status(result.success ? 200 : 400).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Toggle comment status error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    bulkDeleteComments: async (req, res) => {
        try {
            const { commentIds } = req.body;

            if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
                return res.status(400).json({
                    EM: 'Comment IDs are required',
                    EC: 1,
                    DT: null
                });
            }

            const result = await commentService.bulkDeleteComments({
                commentIds: commentIds.map(id => parseInt(id))
            });

            return res.status(result.success ? 200 : 400).json({
                EM: result.message,
                EC: result.success ? 0 : 1,
                DT: result.data
            });
        } catch (error) {
            console.error('Bulk delete comments error:', error);
            return res.status(500).json({
                EM: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    }
};

export default commentController;
