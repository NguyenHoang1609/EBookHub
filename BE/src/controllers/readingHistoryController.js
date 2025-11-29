import readingHistoryService from '../serivces/readingHistoryService';

const record = async (req, res) => {
    try {
        const { userId, ebookId } = req.body;
        const result = await readingHistoryService.recordRead(userId, ebookId);
        return res.status(result.EC === 0 ? 201 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

const list = async (req, res) => {
    try {
        const { userId, limit } = req.query;
        const result = await readingHistoryService.listByUser(userId, limit ? parseInt(limit, 10) : 100);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

const remove = async (req, res) => {
    try {
        const { userId, ebookId } = req.body;
        const result = await readingHistoryService.remove(userId, ebookId);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

export default { record, list, remove };


