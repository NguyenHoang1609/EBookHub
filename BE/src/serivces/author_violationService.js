const { AuthorViolation, User, Ebook } = require('../models');

const createViolation = async (violationData) => {
    try {
        const { authorId, ebookId, type, reason, reportedBy } = violationData;

        // Validate required fields
        if (!authorId || !type || !reason || !reportedBy) {
            return {
                success: false,
                message: 'Missing required fields: authorId, type, reason, reportedBy'
            };
        }

        // Validate violation type
        const validTypes = ['copyright', 'plagiarism', 'abuse', 'spam', 'other'];
        if (!validTypes.includes(type)) {
            return {
                success: false,
                message: 'Invalid violation type'
            };
        }

        // Check if author exists
        const author = await User.findByPk(authorId);
        if (!author) {
            return {
                success: false,
                message: 'Author not found'
            };
        }

        // Check if ebook exists (if provided)
        if (ebookId) {
            const ebook = await Ebook.findByPk(ebookId);
            if (!ebook) {
                return {
                    success: false,
                    message: 'Ebook not found'
                };
            }
        }

        // Check if reporter exists
        const reporter = await User.findByPk(reportedBy);
        if (!reporter) {
            return {
                success: false,
                message: 'Reporter not found'
            };
        }

        // Create violation
        const violation = await AuthorViolation.create({
            authorId,
            ebookId,
            type,
            reason,
            reportedBy,
            status: 'open'
        });

        // Fetch the created violation with associations
        const createdViolation = await AuthorViolation.findByPk(violation.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: User,
                    as: 'reporter',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Ebook,
                    as: 'ebook',
                    attributes: ['ebookId', 'title', 'coverImage', 'status']
                }
            ]
        });

        return {
            success: true,
            message: 'Violation created successfully',
            data: createdViolation
        };
    } catch (error) {
        console.error('Error creating violation:', error);
        return {
            success: false,
            message: 'Failed to create violation'
        };
    }
};

const getAllViolations = async (options = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            type,
            authorId,
            ebookId
        } = options;

        // Build where clause
        const whereClause = {};
        if (status) whereClause.status = status;
        if (type) whereClause.type = type;
        if (authorId) whereClause.authorId = authorId;
        if (ebookId) whereClause.ebookId = ebookId;

        // Calculate offset
        const offset = (page - 1) * limit;

        // Get violations with pagination
        const { count, rows } = await AuthorViolation.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: User,
                    as: 'reporter',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Ebook,
                    as: 'ebook',
                    attributes: ['ebookId', 'title', 'coverImage', 'status']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        // Calculate pagination info
        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            success: true,
            message: 'Violations retrieved successfully',
            data: {
                violations: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems: count,
                    itemsPerPage: parseInt(limit),
                    hasNextPage,
                    hasPrevPage
                }
            }
        };
    } catch (error) {
        console.error('Error getting violations:', error);
        return {
            success: false,
            message: 'Failed to retrieve violations'
        };
    }
};

const getViolationById = async (id) => {
    try {
        const violation = await AuthorViolation.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: User,
                    as: 'reporter',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Ebook,
                    as: 'ebook',
                    attributes: ['ebookId', 'title', 'coverImage', 'status']
                }
            ]
        });

        if (!violation) {
            return {
                success: false,
                message: 'Violation not found'
            };
        }

        return {
            success: true,
            message: 'Violation retrieved successfully',
            data: violation
        };
    } catch (error) {
        console.error('Error getting violation:', error);
        return {
            success: false,
            message: 'Failed to retrieve violation'
        };
    }
};

const updateViolationStatus = async (id, updateData) => {
    try {
        const { status, actionTaken } = updateData;

        // Validate status
        const validStatuses = ['open', 'under_review', 'resolved', 'dismissed'];
        if (status && !validStatuses.includes(status)) {
            return {
                success: false,
                message: 'Invalid status'
            };
        }

        const violation = await AuthorViolation.findByPk(id);
        if (!violation) {
            return {
                success: false,
                message: 'Violation not found'
            };
        }

        // Update violation
        await violation.update({
            status: status || violation.status,
            actionTaken: actionTaken || violation.actionTaken
        });

        // Fetch updated violation with associations
        const updatedViolation = await AuthorViolation.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: User,
                    as: 'reporter',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Ebook,
                    as: 'ebook',
                    attributes: ['ebookId', 'title', 'coverImage', 'status']
                }
            ]
        });

        return {
            success: true,
            message: 'Violation status updated successfully',
            data: updatedViolation
        };
    } catch (error) {
        console.error('Error updating violation:', error);
        return {
            success: false,
            message: 'Failed to update violation'
        };
    }
};

const deleteViolation = async (id) => {
    try {
        const violation = await AuthorViolation.findByPk(id);
        if (!violation) {
            return {
                success: false,
                message: 'Violation not found'
            };
        }

        await violation.destroy();

        return {
            success: true,
            message: 'Violation deleted successfully',
            data: { id }
        };
    } catch (error) {
        console.error('Error deleting violation:', error);
        return {
            success: false,
            message: 'Failed to delete violation'
        };
    }
};

const getViolationStats = async () => {
    try {
        const stats = await AuthorViolation.findAll({
            attributes: [
                'status',
                'type',
                [AuthorViolation.sequelize.fn('COUNT', AuthorViolation.sequelize.col('id')), 'count']
            ],
            group: ['status', 'type'],
            raw: true
        });

        // Get total counts
        const totalViolations = await AuthorViolation.count();
        const openViolations = await AuthorViolation.count({ where: { status: 'open' } });
        const underReviewViolations = await AuthorViolation.count({ where: { status: 'under_review' } });
        const resolvedViolations = await AuthorViolation.count({ where: { status: 'resolved' } });
        const dismissedViolations = await AuthorViolation.count({ where: { status: 'dismissed' } });

        // Get violations by type
        const violationsByType = await AuthorViolation.findAll({
            attributes: [
                'type',
                [AuthorViolation.sequelize.fn('COUNT', AuthorViolation.sequelize.col('id')), 'count']
            ],
            group: ['type'],
            raw: true
        });

        return {
            success: true,
            message: 'Violation statistics retrieved successfully',
            data: {
                totalViolations,
                statusCounts: {
                    open: openViolations,
                    under_review: underReviewViolations,
                    resolved: resolvedViolations,
                    dismissed: dismissedViolations
                },
                violationsByType,
                detailedStats: stats
            }
        };
    } catch (error) {
        console.error('Error getting violation stats:', error);
        return {
            success: false,
            message: 'Failed to retrieve violation statistics'
        };
    }
};

const updateEbookStatus = async (ebookId, status) => {
    try {
        // Validate status
        const validStatuses = ['draft', 'published', 'archived', 'pending_review', 'blocked'];
        if (!validStatuses.includes(status)) {
            return {
                success: false,
                message: 'Invalid ebook status'
            };
        }

        const ebook = await Ebook.findByPk(ebookId);
        if (!ebook) {
            return {
                success: false,
                message: 'Ebook not found'
            };
        }
        console.log('ebook', ebook);
        console.log('status', status);
        await ebook.update({
            status: status
        });

        return {
            success: true,
            message: 'Ebook status updated successfully',
            data: ebook
        };
    } catch (error) {
        console.error('Error updating ebook status:', error);
        return {
            success: false,
            message: 'Failed to update ebook status'
        };
    }
};

module.exports = {
    createViolation,
    getAllViolations,
    getViolationById,
    updateViolationStatus,
    deleteViolation,
    getViolationStats,
    updateEbookStatus
};
