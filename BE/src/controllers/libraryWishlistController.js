import libraryWishlistService from '../serivces/libraryWishlistService';

const add = async (req, res) => {
    try {
        const { userId, ebookId } = req.body;
        const result = await libraryWishlistService.addToWishlist(userId, ebookId);
        return res.status(result.EC === 0 ? 201 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

const remove = async (req, res) => {
    try {
        const { userId, ebookId } = req.body;
        const result = await libraryWishlistService.removeFromWishlist(userId, ebookId);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

const list = async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await libraryWishlistService.getWishlist(userId);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: '', EC: -1, EM: 'Internal server error.' });
    }
};

const check = async (req, res) => {
    try {
        const { userId, ebookId } = req.query;
        const result = await libraryWishlistService.isBookInWishlist(userId, ebookId);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (e) {
        return res.status(500).json({ DT: false, EC: -1, EM: 'Internal server error.' });
    }
};

export default {
    add,
    remove,
    list,
    check
};
