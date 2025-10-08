import savedPageService from '../serivces/savedPageService';

const saveOrUpdate = async (req, res) => {
    try {
        const { userId, bookId, pageNumber } = req.body;
        const result = await savedPageService.saveOrUpdatePage(userId, bookId, pageNumber);
        return res.status(result.EC === 0 ? 201 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

const remove = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const result = await savedPageService.removeSavedPage(userId, bookId);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

const list = async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await savedPageService.getSavedPages(userId);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

const get = async (req, res) => {
    try {
        const { userId, bookId } = req.query;
        const result = await savedPageService.getSavedPage(userId, bookId);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

export default {
    saveOrUpdate,
    remove,
    list,
    get
};
