import Payment from '../models/Payment';
import User from '../models/User';

const VIP_PRICE_VND = 2000; // adjust as needed for real pricing

function extractUserIdFromContent(content = '') {
    if (!content) return null;
    const normalized = content.replace(/\s+/g, ' ').trim();
    const match = normalized.match(/DH\s*(\d+)/i);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }
    return null;
}

async function createPayment(data) {
    return await Payment.create(data);
}

async function listPayments({ page = 1, limit = 10, status, userId } = {}) {
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const { rows, count } = await Payment.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: parsedLimit,
        offset
    });

    return {
        rows,
        pagination: {
            page: parsedPage,
            limit: parsedLimit,
            total: count,
            totalPages: Math.ceil(count / parsedLimit) || 0
        }
    };
}

async function getPaymentById(id) {
    return await Payment.findByPk(id);
}

async function updatePayment(id, updates) {
    await Payment.update(updates, { where: { id } });
    return await getPaymentById(id);
}

async function deletePayment(id) {
    return await Payment.destroy({ where: { id } });
}

async function handleWebhook(queryOrBody = {}) {
    const payload = queryOrBody;

    const {
        id: webhookId,
        gateway,
        transactionDate,
        accountNumber,
        code,
        content,
        transferType,
        transferAmount,
        accumulated,
        subAccount,
        referenceCode,
        description
    } = payload;

    const userIdFromContent = extractUserIdFromContent(content || description || '');

    if (!userIdFromContent) {
        // store as pending with unknown user
        await Payment.create({
            webhookId,
            userId: 0,
            amount: (transferAmount || 0),
            description: content || null,
            accountNumber: accountNumber || null,
            gateway: gateway || null,
            transactionDate: transactionDate ? new Date(transactionDate) : null,
            code: code || null,
            content: content || null,
            transferType: transferType || null,
            transferAmount: transferAmount || null,
            accumulated: accumulated || null,
            subAccount: subAccount || null,
            referenceCode: referenceCode || null,
            rawDescription: description || null,
            status: 'pending'
        });
        return { success: false, reason: 'USER_NOT_FOUND_IN_CONTENT' };
    }

    const user = await User.findByPk(userIdFromContent);
    if (!user) {
        await Payment.create({
            webhookId,
            userId: userIdFromContent,
            amount: (transferAmount || 0),
            description: content || null,
            accountNumber: accountNumber || null,
            gateway: gateway || null,
            transactionDate: transactionDate ? new Date(transactionDate) : null,
            code: code || null,
            content: content || null,
            transferType: transferType || null,
            transferAmount: transferAmount || null,
            accumulated: accumulated || null,
            subAccount: subAccount || null,
            referenceCode: referenceCode || null,
            rawDescription: description || null,
            status: 'failed'
        });
        return { success: false, reason: 'USER_NOT_EXIST' };
    }

    // determine success
    const isIncoming = (transferType || '').toLowerCase() === 'in';
    const isVipPrice = Number(transferAmount) === VIP_PRICE_VND;
    const status = isIncoming && isVipPrice ? 'completed' : 'failed';

    await Payment.create({
        webhookId,
        userId: user.id,
        amount: (transferAmount || 0),
        description: content || null,
        accountNumber: accountNumber || null,
        gateway: gateway || null,
        transactionDate: transactionDate ? new Date(transactionDate) : null,
        code: code || null,
        content: content || null,
        transferType: transferType || null,
        transferAmount: transferAmount || null,
        accumulated: accumulated || null,
        subAccount: subAccount || null,
        referenceCode: referenceCode || null,
        rawDescription: description || null,
        status
    });

    if (status === 'completed') {
        // activate VIP
        await User.update({ is_vip: true }, { where: { id: user.id } });
    }

    return { success: status === 'completed' };
}

async function checkPaymentStatus({ userId, amount }) {

    const payments = await Payment.findAll({
        where: { userId, status: 'completed' },
        order: [['created_at', 'DESC']],
        limit: 5
    });
    console.log('payments', payments);

    const matched = payments.find(p => Number(p.transferAmount || p.amount) === Number(amount || VIP_PRICE_VND));
    const user = await User.findByPk(userId);
    console.log('matched', matched);
    console.log('user', user);
    return {
        hasPaid: !!matched,
        is_vip: !!user?.is_vip,
    };
}

async function getPaymentsByUserId(userId) {
    if (!userId) return [];
    return await Payment.findAll({
        where: { userId },
        order: [['created_at', 'DESC']]
    });
}

export default {
    createPayment,
    listPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    handleWebhook,
    checkPaymentStatus,
    extractUserIdFromContent,
    getPaymentsByUserId
};


