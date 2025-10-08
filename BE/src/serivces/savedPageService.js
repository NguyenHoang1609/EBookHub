import db from '../models';

const saveOrUpdatePage = async (userId, bookId, pageNumber) => {
    try {
        if (!userId || !bookId || !pageNumber) {
            return { DT: '', EC: -1, EM: 'User ID, Book ID, and Page Number are required!' };
        }
        // Upsert: update if exists, else create
        const [item, created] = await db.SavedPage.findOrCreate({
            where: { userId, bookId },
            defaults: { userId, bookId, pageNumber }
        });
        if (!created) {
            await item.update({ pageNumber });
        }
        return { DT: item, EC: 0, EM: created ? 'Page saved.' : 'Page updated.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to save page.' };
    }
};

const removeSavedPage = async (userId, bookId) => {
    try {
        if (!userId || !bookId) {
            return { DT: '', EC: -1, EM: 'User ID and Book ID are required!' };
        }
        const deleted = await db.SavedPage.destroy({ where: { userId, bookId } });
        if (deleted === 0) {
            return { DT: '', EC: 1, EM: 'No saved page found.' };
        }
        return { DT: '', EC: 0, EM: 'Saved page removed.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to remove saved page.' };
    }
};

const getSavedPages = async (userId) => {
    try {
        if (!userId) {
            return { DT: '', EC: -1, EM: 'User ID is required!' };
        }
        const items = await db.SavedPage.findAll({
            where: { userId },
            include: [
                { model: db.Ebook, as: 'ebook' }
            ],
            order: [['updated_at', 'DESC']]
        });
        return { DT: items, EC: 0, EM: 'Saved pages retrieved.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to retrieve saved pages.' };
    }
};

const getSavedPage = async (userId, bookId) => {
    try {
        if (!userId || !bookId) {
            return { DT: '', EC: -1, EM: 'User ID and Book ID are required!' };
        }
        const item = await db.SavedPage.findOne({ where: { userId, bookId } });
        return { DT: item, EC: 0, EM: 'Saved page retrieved.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to retrieve saved page.' };
    }
};

export default {
    saveOrUpdatePage,
    removeSavedPage,
    getSavedPages,
    getSavedPage
};
