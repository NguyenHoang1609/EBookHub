import db from '../models';

const recordRead = async (userId, ebookId) => {
    try {
        if (!userId || !ebookId) {
            return { DT: '', EC: -1, EM: 'User ID and Ebook ID are required!' };
        }
        const [item, created] = await db.ReadingHistory.findOrCreate({
            where: { userId, ebookId },
            defaults: { userId, ebookId, lastReadAt: new Date() }
        });
        if (!created) {
            await item.update({ lastReadAt: new Date() });
        }
        return { DT: item, EC: 0, EM: created ? 'Reading recorded.' : 'Reading updated.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to record reading history.' };
    }
};

const listByUser = async (userId, limit = 100) => {
    try {
        if (!userId) {
            return { DT: '', EC: -1, EM: 'User ID is required!' };
        }
        const items = await db.ReadingHistory.findAll({
            where: { userId },
            include: [
                { model: db.Ebook, as: 'ebook' }
            ],
            order: [['last_read_at', 'DESC']],
            limit
        });
        return { DT: items, EC: 0, EM: 'Reading history retrieved.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to retrieve reading history.' };
    }
};

const remove = async (userId, ebookId) => {
    try {
        if (!userId || !ebookId) {
            return { DT: '', EC: -1, EM: 'User ID and Ebook ID are required!' };
        }
        const deleted = await db.ReadingHistory.destroy({ where: { userId, ebookId } });
        if (deleted === 0) {
            return { DT: '', EC: 1, EM: 'No reading history found.' };
        }
        return { DT: '', EC: 0, EM: 'Reading history removed.' };
    } catch (error) {
        return { DT: '', EC: -1, EM: 'Failed to remove reading history.' };
    }
};

export default { recordRead, listByUser, remove };


