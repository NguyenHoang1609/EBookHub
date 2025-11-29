const { ReviewRating, User, Ebook } = require('../models');
const { Op } = require('sequelize');

class RatingService {
    // Create or update a rating
    async createOrUpdateRating(userId, ebookId, rating, reviewText = null) {
        try {
            // Check if rating already exists
            const existingRating = await ReviewRating.findOne({
                where: {
                    userId: userId,
                    ebookId: ebookId
                }
            });

            if (existingRating) {
                // Update existing rating
                await existingRating.update({
                    rating: rating,
                    reviewText: reviewText
                });
                return {
                    success: true,
                    message: 'Rating updated successfully',
                    data: existingRating
                };
            } else {
                // Create new rating
                const newRating = await ReviewRating.create({
                    userId: userId,
                    ebookId: ebookId,
                    rating: rating,
                    reviewText: reviewText
                });
                return {
                    success: true,
                    message: 'Rating created successfully',
                    data: newRating
                };
            }
        } catch (error) {
            console.error('Error in createOrUpdateRating:', error);
            return {
                success: false,
                message: 'Failed to create/update rating',
                error: error.message
            };
        }
    }

    // Get ratings for a specific ebook
    async getRatingsByEbook(ebookId, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await ReviewRating.findAndCountAll({
                where: { ebookId: ebookId },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit: limit,
                offset: offset
            });

            // Calculate average rating
            const avgRating = await ReviewRating.findOne({
                where: { ebookId: ebookId },
                attributes: [
                    [ReviewRating.sequelize.fn('AVG', ReviewRating.sequelize.col('rating')), 'averageRating'],
                ],
                raw: true
            });

            // Get rating distribution
            const ratingDistribution = await ReviewRating.findAll({
                where: { ebookId: ebookId },
                attributes: [
                    'rating',
                    [ReviewRating.sequelize.fn('COUNT', ReviewRating.sequelize.col('rating')), 'count']
                ],
                group: ['rating'],
                raw: true
            });

            return {
                success: true,
                data: {
                    ratings: rows,
                    totalCount: count,
                    averageRating: parseFloat(avgRating.averageRating) || 0,
                    ratingDistribution: ratingDistribution,
                    pagination: {
                        page: page,
                        limit: limit,
                        totalPages: Math.ceil(count / limit)
                    }
                }
            };
        } catch (error) {
            console.error('Error in getRatingsByEbook:', error);
            return {
                success: false,
                message: 'Failed to get ratings',
                error: error.message
            };
        }
    }

    // Get user's rating for a specific ebook
    async getUserRating(userId, ebookId) {
        try {
            const rating = await ReviewRating.findOne({
                where: {
                    userId: userId,
                    ebookId: ebookId
                },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar']
                    }
                ]
            });

            return {
                success: true,
                data: rating
            };
        } catch (error) {
            console.error('Error in getUserRating:', error);
            return {
                success: false,
                message: 'Failed to get user rating',
                error: error.message
            };
        }
    }

    // Delete a rating
    async deleteRating(userId, ebookId) {
        try {
            const deleted = await ReviewRating.destroy({
                where: {
                    userId: userId,
                    ebookId: ebookId
                }
            });

            if (deleted > 0) {
                return {
                    success: true,
                    message: 'Rating deleted successfully'
                };
            } else {
                return {
                    success: false,
                    message: 'Rating not found'
                };
            }
        } catch (error) {
            console.error('Error in deleteRating:', error);
            return {
                success: false,
                message: 'Failed to delete rating',
                error: error.message
            };
        }
    }

    // Get top rated ebooks
    async getTopRatedEbooks(limit = 10) {
        try {
            const topRatedEbooks = await ReviewRating.findAll({
                attributes: [
                    'ebook_id',
                    [ReviewRating.sequelize.fn('AVG', ReviewRating.sequelize.col('rating')), 'averageRating'],
                    [ReviewRating.sequelize.fn('COUNT', ReviewRating.sequelize.col('rating')), 'ratingCount']
                ],
                include: [
                    {
                        model: Ebook,
                        as: 'ebook',
                        attributes: ['ebook_id', 'title', 'coverImage', 'isVipEbook', 'viewCount'],
                        include: [
                            {
                                model: User,
                                as: 'author',
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ],
                group: ['ebook_id', 'ebook.ebook_id', 'ebook.author.id'],
                having: ReviewRating.sequelize.literal('ratingCount >= 1'),
                order: [
                    [ReviewRating.sequelize.literal('averageRating'), 'DESC'],//danh gia tb
                    [ReviewRating.sequelize.literal('ratingCount'), 'DESC']//luot danh gia
                ],
                limit: limit
            });

            return {
                success: true,
                data: topRatedEbooks
            };
        } catch (error) {
            console.error('Error in getTopRatedEbooks:', error);
            return {
                success: false,
                message: 'Failed to get top rated ebooks',
                error: error.message
            };
        }
    }

    // Get rating statistics for admin
    async getRatingStatistics() {
        try {
            const totalRatings = await ReviewRating.count();
            const averageRating = await ReviewRating.findOne({
                attributes: [
                    [ReviewRating.sequelize.fn('AVG', ReviewRating.sequelize.col('rating')), 'averageRating']
                ],
                raw: true
            });

            const ratingDistribution = await ReviewRating.findAll({
                attributes: [
                    'rating',
                    [ReviewRating.sequelize.fn('COUNT', ReviewRating.sequelize.col('rating')), 'count']
                ],
                group: ['rating'],
                order: [['rating', 'ASC']],
                raw: true
            });

            return {
                success: true,
                data: {
                    totalRatings,
                    averageRating: parseFloat(averageRating.averageRating) || 0,
                    ratingDistribution
                }
            };
        } catch (error) {
            console.error('Error in getRatingStatistics:', error);
            return {
                success: false,
                message: 'Failed to get rating statistics',
                error: error.message
            };
        }
    }
}

module.exports = new RatingService();
