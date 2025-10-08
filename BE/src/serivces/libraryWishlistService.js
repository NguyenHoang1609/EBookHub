import db from '../models';

const addToWishlist = async (userId, ebookId) => {
    try {
        if (!userId || !ebookId) {
            return { DT: '', EC: -1, EM: 'User ID and Ebook ID are required!' };
        }
        // Prevent duplicate
        const [item, created] = await db.LibraryWishlist.findOrCreate({
            where: { userId, ebookId },
            defaults: { userId, ebookId }
        });
        if (!created) {
            return { DT: item, EC: 1, EM: 'Book already in wishlist.' };
        }
        return { DT: item, EC: 0, EM: 'Book added to wishlist.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to add to wishlist.' };
    }
};

const removeFromWishlist = async (userId, ebookId) => {
    try {
        if (!userId || !ebookId) {
            return { DT: '', EC: -1, EM: 'User ID and Ebook ID are required!' };
        }
        const deleted = await db.LibraryWishlist.destroy({ where: { userId, ebookId } });
        if (deleted === 0) {
            return { DT: '', EC: 1, EM: 'Book not found in wishlist.' };
        }
        return { DT: '', EC: 0, EM: 'Book removed from wishlist.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to remove from wishlist.' };
    }
};

const getWishlist = async (userId) => {
    try {
        if (!userId) {
            return { DT: '', EC: -1, EM: 'User ID is required!' };
        }
        const items = await db.LibraryWishlist.findAll({
            where: { userId },
            include: [
                { model: db.Ebook, as: 'ebook' }
            ],
            order: [['created_at', 'DESC']]
        });
        return { DT: items, EC: 0, EM: 'Wishlist retrieved successfully.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to retrieve wishlist.' };
    }
};

const isBookInWishlist = async (userId, ebookId) => {
    try {
        if (!userId || !ebookId) {
            return { DT: false, EC: -1, EM: 'User ID and Ebook ID are required!' };
        }
        const item = await db.LibraryWishlist.findOne({ where: { userId, ebookId } });
        return { DT: !!item, EC: 0, EM: 'Check completed.' };
    } catch (error) {
        return { DT: false, EC: -1, EM: 'Failed to check wishlist.' };
    }
};

export default {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    isBookInWishlist
};
