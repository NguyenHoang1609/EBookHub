const ratingService = require('../serivces/ratingService');

class RatingController {
    // Create or update a rating
    async createOrUpdateRating(req, res) {
        try {
            const { userId, ebookId, rating, reviewText } = req.body;

            // Validate required fields
            if (!userId || !ebookId || !rating) {
                return res.status(400).json({
                    success: false,
                    message: 'userId, ebookId, and rating are required'
                });
            }

            // Validate rating range
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }

            const result = await ratingService.createOrUpdateRating(userId, ebookId, rating, reviewText);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Error in createOrUpdateRating controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get ratings for a specific ebook
    async getRatingsByEbook(req, res) {
        try {
            const { ebookId } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!ebookId) {
                return res.status(400).json({
                    success: false,
                    message: 'ebookId is required'
                });
            }

            const result = await ratingService.getRatingsByEbook(ebookId, parseInt(page), parseInt(limit));

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Error in getRatingsByEbook controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get user's rating for a specific ebook
    async getUserRating(req, res) {
        try {
            const { userId, ebookId } = req.query;

            if (!userId || !ebookId) {
                return res.status(400).json({
                    success: false,
                    message: 'userId and ebookId are required'
                });
            }

            const result = await ratingService.getUserRating(userId, ebookId);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Error in getUserRating controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Delete a rating
    async deleteRating(req, res) {
        try {
            const { userId, ebookId } = req.body;

            if (!userId || !ebookId) {
                return res.status(400).json({
                    success: false,
                    message: 'userId and ebookId are required'
                });
            }

            const result = await ratingService.deleteRating(userId, ebookId);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Error in deleteRating controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get top rated ebooks
    async getTopRatedEbooks(req, res) {
        try {
            const { limit = 10 } = req.query;
            const result = await ratingService.getTopRatedEbooks(parseInt(limit));

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Error in getTopRatedEbooks controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // Get rating statistics
    async getRatingStatistics(req, res) {
        try {
            const result = await ratingService.getRatingStatistics();

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Error in getRatingStatistics controller:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = new RatingController();
