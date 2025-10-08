import contentModerationService from '../serivces/contentModerationService';

const createModerationWord = async (req, res) => {
    try {
        const moderationData = {
            ...req.body,
            createdBy: req.user?.id || null
        };

        const result = await contentModerationService.createModerationWord(moderationData);

        if (result.EC === 0) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Create moderation word controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const getAllModerationWords = async (req, res) => {
    try {
        const queryParams = req.query;
        const result = await contentModerationService.getAllModerationWords(queryParams);

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Get all moderation words controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const getModerationWordById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await contentModerationService.getModerationWordById(id);

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Get moderation word by ID controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const updateModerationWord = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.id || null
        };

        const result = await contentModerationService.updateModerationWord(id, updateData);

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Update moderation word controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const deleteModerationWord = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await contentModerationService.deleteModerationWord(id);

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Delete moderation word controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const bulkDeleteModerationWords = async (req, res) => {
    try {
        const { moderationIds } = req.body;
        const result = await contentModerationService.bulkDeleteModerationWords(moderationIds);

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Bulk delete moderation words controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const getModerationStats = async (req, res) => {
    try {
        const result = await contentModerationService.getModerationStats();

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Get moderation stats controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const validateContent = async (req, res) => {
    try {
        const { content } = req.body;
        const result = await contentModerationService.validateContent(content);

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Validate content controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const validateEbookContent = async (req, res) => {
    try {
        const { ebookId } = req.params;
        const result = await contentModerationService.validateEbookContent(ebookId);

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Validate ebook content controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const validateAllEbooks = async (req, res) => {
    try {
        const result = await contentModerationService.validateAllEbooks();

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Validate all ebooks controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

const validateCommentContent = async (req, res) => {
    try {
        const { content } = req.body;
        const result = await contentModerationService.validateCommentContent(content);

        if (result.EC === 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Validate comment content controller error:', error);
        res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error!'
        });
    }
};

export default {
    createModerationWord,
    getAllModerationWords,
    getModerationWordById,
    updateModerationWord,
    deleteModerationWord,
    bulkDeleteModerationWords,
    getModerationStats,
    validateContent,
    validateEbookContent,
    validateAllEbooks,
    validateCommentContent
};
