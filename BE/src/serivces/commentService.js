import db from '../models/index';
import { Op } from 'sequelize';
import contentModerationService from './contentModerationService';
const commentService = {
    // Get all comments for an ebook with pagination and nesting
    getCommentsByEbook: async ({ ebookId, page = 1, limit = 20, sortBy = 'created_at', order = 'DESC' }) => {
        try {
            const offset = (page - 1) * limit;

            // First, get all top-level comments (no parent)
            const { count, rows: topLevelComments } = await db.Comment.findAndCountAll({
                where: {
                    ebookId: ebookId,
                    parentCommentId: null,
                    isActive: true
                },
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar']
                    }
                ],
                order: [['id', 'ASC']],
                limit: limit,
                offset: offset
            });

            // Get all replies for the top-level comments
            const commentIds = topLevelComments.map(comment => comment.id);
            const replies = commentIds.length > 0 ? await db.Comment.findAll({
                where: {
                    parentCommentId: {
                        [Op.in]: commentIds
                    },
                    isActive: true
                },
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar']
                    }
                ],
                order: [['id', 'ASC']]
            }) : [];

            // Organize replies under their parent comments
            const commentsWithReplies = topLevelComments.map(comment => {
                const commentReplies = replies.filter(reply => reply.parentCommentId === comment.id);
                return {
                    ...comment.toJSON(),
                    replies: commentReplies
                };
            });

            const totalPages = Math.ceil(count / limit);

            return {
                success: true,
                message: 'Comments retrieved successfully',
                data: {
                    comments: commentsWithReplies,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalComments: count,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    }
                }
            };
        } catch (error) {
            console.error('Get comments by ebook error:', error);
            return {
                success: false,
                message: 'Failed to retrieve comments',
                data: null
            };
        }
    },

    // Create a new comment
    createComment: async ({ userId, ebookId, content, parentCommentId = null }) => {
        const transaction = await db.sequelize.transaction();

        try {
            // Validate ebook exists
            const ebook = await db.Ebook.findByPk(ebookId);
            if (!ebook) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'Ebook not found',
                    data: null
                };
            }

            // Validate user exists
            const user = await db.User.findByPk(userId);
            if (!user) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'User not found',
                    data: null
                };
            }





            // If parentCommentId is provided, validate parent comment exists
            if (parentCommentId) {
                const parentComment = await db.Comment.findOne({
                    where: {
                        id: parentCommentId,
                        ebookId: ebookId,
                        isActive: true
                    }
                });

                if (!parentComment) {
                    await transaction.rollback();
                    return {
                        success: false,
                        message: 'Parent comment not found',
                        data: null
                    };
                }

                // Prevent nested replies (only allow one level of nesting)
                if (parentComment.parentCommentId !== null) {
                    await transaction.rollback();
                    return {
                        success: false,
                        message: 'Cannot reply to a reply. Please reply to the main comment.',
                        data: null
                    };
                }
            }

            // Create the comment
            const newComment = await db.Comment.create({
                userId,
                ebookId,
                content,
                parentCommentId
            }, { transaction });

            // Fetch the created comment with user details
            const commentWithUser = await db.Comment.findByPk(newComment.id, {
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar']
                    }
                ],
                transaction
            });

            await transaction.commit();

            return {
                success: true,
                message: 'Comment created successfully',
                data: commentWithUser
            };
        } catch (error) {
            await transaction.rollback();
            console.error('Create comment error:', error);
            return {
                success: false,
                message: 'Failed to create comment',
                data: null
            };
        }
    },

    // Update a comment
    updateComment: async ({ commentId, userId, content }) => {
        const transaction = await db.sequelize.transaction();

        try {
            // Find the comment
            const comment = await db.Comment.findOne({
                where: {
                    id: commentId,
                    isActive: true
                }
            });

            if (!comment) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'Comment not found',
                    data: null
                };
            }

            // Check if user owns the comment
            if (comment.userId !== userId) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'You can only edit your own comments',
                    data: null
                };
            }

            // Update the comment
            await comment.update({
                content
            }, { transaction });

            // Fetch updated comment with user details
            const updatedComment = await db.Comment.findByPk(commentId, {
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar']
                    }
                ],
                transaction
            });

            await transaction.commit();

            return {
                success: true,
                message: 'Comment updated successfully',
                data: updatedComment
            };
        } catch (error) {
            await transaction.rollback();
            console.error('Update comment error:', error);
            return {
                success: false,
                message: 'Failed to update comment',
                data: null
            };
        }
    },

    // Delete a comment (soft delete)
    deleteComment: async ({ commentId, userId }) => {
        const transaction = await db.sequelize.transaction();

        try {
            // Find the comment
            const comment = await db.Comment.findOne({
                where: {
                    id: commentId,
                   
                }
            });

            if (!comment) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'Comment not found',
                    data: null
                };
            }

            // Check if user owns the comment or has admin rights
            // const user = await db.User.findOne(
            //     {id:userId}
            //     , {
            //     include: [
            //         {
            //             model: db.Group,
            //             as: 'group',
            //             include: [
            //                 {
            //                     model: db.Role,
            //                     as: 'roles'
            //                 }
            //             ]
            //         }
            //     ]
            // });

            // const isAdmin = user?.group?.roles?.some(role => role.name === 'admin');
            // const isOwner = comment.userId === userId;

            // if (!isOwner && !isAdmin) {
            //     await transaction.rollback();
            //     return {
            //         success: false,
            //         message: 'You can only delete your own comments',
            //         data: null
            //     };
            // }

            // Soft delete the comment and its replies
            await comment.update({
                isActive: false
            }, { transaction });

            // Also soft delete all replies to this comment
            await db.Comment.update(
                { isActive: false },
                {
                    where: {
                        parent_comment_id: commentId
                    },
                    transaction
                }
            );

            await transaction.commit();

            return {
                success: true,
                message: 'Comment deleted successfully',
                data: null
            };
        } catch (error) {
            await transaction.rollback();
            console.error('Delete comment error:', error);
            return {
                success: false,
                message: 'Failed to delete comment',
                data: null
            };
        }
    },

    // Get comment statistics for an ebook
    getCommentStats: async ({ ebookId }) => {
        try {
            const stats = await db.Comment.findAll({
                where: {
                    ebookId: ebookId,
                    isActive: true
                },
                attributes: [
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalComments'],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN parent_comment_id IS NULL THEN 1 END')
                        ),
                        'topLevelComments'
                    ],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN parent_comment_id IS NOT NULL THEN 1 END')
                        ),
                        'replies'
                    ]
                ],
                raw: true
            });

            return {
                success: true,
                message: 'Comment statistics retrieved successfully',
                data: stats[0] || {
                    totalComments: 0,
                    topLevelComments: 0,
                    replies: 0
                }
            };
        } catch (error) {
            console.error('Get comment stats error:', error);
            return {
                success: false,
                message: 'Failed to retrieve comment statistics',
                data: null
            };
        }
    },

    // Admin-specific service methods
    getAllCommentsForAdmin: async ({ page = 1, limit = 20, search = '', status = 'all', ebookId = null, sortBy = 'created_at', order = 'DESC' }) => {
        try {
            const offset = (page - 1) * limit;

            // Build where conditions
            const whereConditions = {};

            // Status filter
            if (status !== 'all') {
                whereConditions.isActive = status === 'active';
            }

            // Ebook filter
            if (ebookId) {
                whereConditions.ebookId = ebookId;
            }

            // Search filter
            const searchConditions = search ? {
                [Op.or]: [
                    { content: { [Op.like]: `%${search}%` } },
                    { '$user.name$': { [Op.like]: `%${search}%` } },
                    { '$ebook.title$': { [Op.like]: `%${search}%` } }
                ]
            } : {};

            const finalWhereConditions = {
                ...whereConditions,
                ...searchConditions
            };

            // Get all comments (both top-level and replies)
            const { count, rows: allComments } = await db.Comment.findAndCountAll({
                where: finalWhereConditions,
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar']
                    },
                    {
                        model: db.Ebook,
                        as: 'ebook',
                        attributes: ['ebookId', 'title']
                    }
                ],
                order: [[sortBy, order]],
                limit: limit,
                offset: offset,
                distinct: true
            });

            // Separate top-level comments and replies
            const topLevelComments = allComments.filter(comment => comment.parentCommentId === null);
            const replies = allComments.filter(comment => comment.parentCommentId !== null);

            // Group replies by parent comment ID
            const repliesMap = {};
            replies.forEach(reply => {
                if (!repliesMap[reply.parentCommentId]) {
                    repliesMap[reply.parentCommentId] = [];
                }
                repliesMap[reply.parentCommentId].push(reply);
            });

            // Attach replies to their parent comments
            const commentsWithReplies = topLevelComments.map(comment => ({
                ...comment.toJSON(),
                replies: repliesMap[comment.id] || []
            }));

            // Get statistics
            const stats = await db.Comment.findAll({
                where: status !== 'all' ? { isActive: status === 'active' } : {},
                attributes: [
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN is_active = true THEN 1 END')
                        ),
                        'active'
                    ],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN is_active = false THEN 1 END')
                        ),
                        'inactive'
                    ],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN parent_comment_id IS NULL THEN 1 END')
                        ),
                        'topLevel'
                    ],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN parent_comment_id IS NOT NULL THEN 1 END')
                        ),
                        'replies'
                    ]
                ],
                raw: true
            });

            const totalPages = Math.ceil(count / limit);

            return {
                success: true,
                message: 'Comments retrieved successfully',
                data: {
                    comments: commentsWithReplies,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalComments: count,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    },
                    stats: stats[0] || {
                        total: 0,
                        active: 0,
                        inactive: 0,
                        topLevel: 0,
                        replies: 0
                    }
                }
            };
        } catch (error) {
            console.error('Get all comments for admin error:', error);
            return {
                success: false,
                message: 'Failed to retrieve comments',
                data: null
            };
        }
    },

    getCommentStatistics: async () => {
        try {
            const stats = await db.Comment.findAll({
                attributes: [
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalComments'],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN is_active = true THEN 1 END')
                        ),
                        'activeComments'
                    ],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN is_active = false THEN 1 END')
                        ),
                        'inactiveComments'
                    ],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN parent_comment_id IS NULL THEN 1 END')
                        ),
                        'topLevelComments'
                    ],
                    [
                        db.sequelize.fn('COUNT',
                            db.sequelize.literal('CASE WHEN parent_comment_id IS NOT NULL THEN 1 END')
                        ),
                        'replies'
                    ]
                ],
                raw: true
            });

            // Get comments per day for the last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const recentComments = await db.Comment.findAll({
                where: {
                    created_at: {
                        [Op.gte]: sevenDaysAgo
                    }
                },
                attributes: [
                    [db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'date'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
                ],
                group: [db.sequelize.fn('DATE', db.sequelize.col('created_at'))],
                order: [[db.sequelize.fn('DATE', db.sequelize.col('created_at')), 'ASC']],
                raw: true
            });

            return {
                success: true,
                message: 'Comment statistics retrieved successfully',
                data: {
                    ...stats[0],
                    recentActivity: recentComments
                }
            };
        } catch (error) {
            console.error('Get comment statistics error:', error);
            return {
                success: false,
                message: 'Failed to retrieve comment statistics',
                data: null
            };
        }
    },

    getCommentsByUser: async ({ userId, page = 1, limit = 20, status = 'all' }) => {
        try {
            const offset = (page - 1) * limit;

            const whereConditions = {
                userId: userId
            };

            if (status !== 'all') {
                whereConditions.isActive = status === 'active';
            }

            const { count, rows: comments } = await db.Comment.findAndCountAll({
                where: whereConditions,
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar']
                    },
                    {
                        model: db.Ebook,
                        as: 'ebook',
                        attributes: ['ebookId', 'title']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: limit,
                offset: offset
            });

            const totalPages = Math.ceil(count / limit);

            return {
                success: true,
                message: 'User comments retrieved successfully',
                data: {
                    comments,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalComments: count,
                        hasNext: page < totalPages,
                        hasPrev: page > 1
                    }
                }
            };
        } catch (error) {
            console.error('Get comments by user error:', error);
            return {
                success: false,
                message: 'Failed to retrieve user comments',
                data: null
            };
        }
    },

    toggleCommentStatus: async ({ commentId, isActive }) => {
        const transaction = await db.sequelize.transaction();

        try {
            // Find the comment
            const comment = await db.Comment.findByPk(commentId);

            if (!comment) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'Comment not found',
                    data: null
                };
            }

            // Update the comment status
            await comment.update({
                isActive: isActive
            }, { transaction });

            // If deactivating a parent comment, also deactivate its replies
            if (!isActive && comment.parentCommentId === null) {
                await db.Comment.update(
                    { isActive: false },
                    {
                        where: {
                            parentCommentId: commentId
                        },
                        transaction
                    }
                );
            }

            await transaction.commit();

            return {
                success: true,
                message: `Comment ${isActive ? 'activated' : 'deactivated'} successfully`,
                data: comment
            };
        } catch (error) {
            await transaction.rollback();
            console.error('Toggle comment status error:', error);
            return {
                success: false,
                message: 'Failed to toggle comment status',
                data: null
            };
        }
    },

    bulkDeleteComments: async ({ commentIds }) => {
        const transaction = await db.sequelize.transaction();

        try {
            // Find all comments to be deleted
            const comments = await db.Comment.findAll({
                where: {
                    id: {
                        [Op.in]: commentIds
                    }
                }
            });

            if (comments.length === 0) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'No comments found to delete',
                    data: null
                };
            }

            // Get parent comment IDs to also delete their replies
            const parentCommentIds = comments
                .filter(comment => comment.parentCommentId === null)
                .map(comment => comment.id);

            // Soft delete all specified comments
            await db.Comment.update(
                { isActive: false },
                {
                    where: {
                        id: {
                            [Op.in]: commentIds
                        }
                    },
                    transaction
                }
            );

            // Also soft delete replies of parent comments
            if (parentCommentIds.length > 0) {
                await db.Comment.update(
                    { isActive: false },
                    {
                        where: {
                            parentCommentId: {
                                [Op.in]: parentCommentIds
                            }
                        },
                        transaction
                    }
                );
            }

            await transaction.commit();

            return {
                success: true,
                message: `Successfully deleted ${comments.length} comments`,
                data: {
                    deletedCount: comments.length,
                    deletedIds: commentIds
                }
            };
        } catch (error) {
            await transaction.rollback();
            console.error('Bulk delete comments error:', error);
            return {
                success: false,
                message: 'Failed to delete comments',
                data: null
            };
        }
    }
};

export default commentService;
