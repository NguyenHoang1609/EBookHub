import paymentService from '../serivces/paymentService';

const create = async (req, res) => {
    try {
        const data = await paymentService.createPayment(req.body);
        return res.status(201).json({ success: true, data: { DT: data } });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

const list = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, userId } = req.query;
        const result = await paymentService.listPayments({ page: Number(page), limit: Number(limit), status, userId: userId ? Number(userId) : undefined });
        return res.status(200).json({ success: true, data: { DT: result.rows, pagination: result.pagination } });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

const getById = async (req, res) => {
    try {
        const data = await paymentService.getPaymentById(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, data: { DT: data } });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

const update = async (req, res) => {
    try {
        const data = await paymentService.updatePayment(req.params.id, req.body);
        return res.status(200).json({ success: true, data: { DT: data } });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

const remove = async (req, res) => {
    try {
        await paymentService.deletePayment(req.params.id);
        return res.status(204).json({ success: true });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

// Webhook callback (GET as requested)
const webhook = async (req, res) => {
    try {
        const result = await paymentService.handleWebhook({ ...req.query, ...req.body });
        return res.status(200).json({ success: true, data: { DT: result } });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

// Polling status check
const checkStatus = async (req, res) => {
    try {
        const { userId, amount } = req.query;
        const data = await paymentService.checkPaymentStatus({ userId: Number(userId), amount: Number(amount) });
        return res.status(200).json({ success: true, data: { DT: data } });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

const getByUserId = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
        const data = await paymentService.getPaymentsByUserId(Number(userId));
        return res.status(200).json({ success: true, data: { DT: data } });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
};

export default { create, list, getById, update, remove, webhook, checkStatus, getByUserId };


