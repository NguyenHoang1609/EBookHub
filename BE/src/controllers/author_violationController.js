const authorViolationService = require('../serivces/author_violationService');

const createViolation = async (req, res) => {
    try {
        const { authorId, ebookId, type, reason, reportedBy } = req.body;


        if (!reportedBy) {
            return res.status(401).json({
                EC: 1,
                EM: 'Authentication required',
                DT: null
            });
        }

        const result = await authorViolationService.createViolation({
            authorId,
            ebookId,
            type,
            reason,
            reportedBy
        });

        if (result.success) {
            return res.status(201).json({
                EC: 0,
                EM: 'Violation report created successfully',
                DT: result.data
            });
        } else {
            return res.status(400).json({
                EC: 1,
                EM: result.message,
                DT: null
            });
        }
    } catch (error) {
        console.error('Error creating violation:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Internal server error',
            DT: null
        });
    }
};

const getAllViolations = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, type, authorId, ebookId } = req.query;

        const result = await authorViolationService.getAllViolations({
            page: parseInt(page),
            limit: parseInt(limit),
            status,
            type,
            authorId,
            ebookId
        });

        if (result.success) {
            return res.status(200).json({
                EC: 0,
                EM: 'Violations retrieved successfully',
                DT: result.data
            });
        } else {
            return res.status(400).json({
                EC: 1,
                EM: result.message,
                DT: null
            });
        }
    } catch (error) {
        console.error('Error getting violations:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Internal server error',
            DT: null
        });
    }
};

const getViolationById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await authorViolationService.getViolationById(id);

        if (result.success) {
            return res.status(200).json({
                EC: 0,
                EM: 'Violation retrieved successfully',
                DT: result.data
            });
        } else {
            return res.status(404).json({
                EC: 1,
                EM: result.message,
                DT: null
            });
        }
    } catch (error) {
        console.error('Error getting violation:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Internal server error',
            DT: null
        });
    }
};

const updateViolationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, actionTaken } = req.body;

        const result = await authorViolationService.updateViolationStatus(id, {
            status,
            actionTaken
        });

        if (result.success) {
            return res.status(200).json({
                EC: 0,
                EM: 'Violation status updated successfully',
                DT: result.data
            });
        } else {
            return res.status(400).json({
                EC: 1,
                EM: result.message,
                DT: null
            });
        }
    } catch (error) {
        console.error('Error updating violation:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Internal server error',
            DT: null
        });
    }
};

const deleteViolation = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await authorViolationService.deleteViolation(id);

        if (result.success) {
            return res.status(200).json({
                EC: 0,
                EM: 'Violation deleted successfully',
                DT: result.data
            });
        } else {
            return res.status(400).json({
                EC: 1,
                EM: result.message,
                DT: null
            });
        }
    } catch (error) {
        console.error('Error deleting violation:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Internal server error',
            DT: null
        });
    }
};

const getViolationStats = async (req, res) => {
    try {
        const result = await authorViolationService.getViolationStats();

        if (result.success) {
            return res.status(200).json({
                EC: 0,
                EM: 'Violation statistics retrieved successfully',
                DT: result.data
            });
        } else {
            return res.status(400).json({
                EC: 1,
                EM: result.message,
                DT: null
            });
        }
    } catch (error) {
        console.error('Error getting violation stats:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Internal server error',
            DT: null
        });
    }
};

const updateEbookStatus = async (req, res) => {
    try {
        const { ebookId } = req.params;
        const { status } = req.body;

        const result = await authorViolationService.updateEbookStatus(ebookId, status);

        if (result.success) {
            return res.status(200).json({
                EC: 0,
                EM: 'Ebook status updated successfully',
                DT: result.data
            });
        } else {
            return res.status(400).json({
                EC: 1,
                EM: result.message,
                DT: null
            });
        }
    } catch (error) {
        console.error('Error updating ebook status:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Internal server error',
            DT: null
        });
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
