import pageService from '../serivces/pageService';

const createPage = async (req, res) => {
    try {
        console.log('Create page request received:', req.body);

        const { ebookId, pageNumber, title, content, imagePath, status } = req.body;

        if (!ebookId || !pageNumber || !content) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Missing required fields: ebookId, pageNumber, and content are required!'
            });
        }

        const result = await pageService.createPage({
            ebookId,
            pageNumber,
            title,
            content,
            imagePath,
            status
        });

        if (result.EC === 0) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Create page controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during page creation'
        });
    }
};

const getPagesByEbook = async (req, res) => {
    try {
        console.log('Get pages by ebook request received:', req.params);

        const { ebookId } = req.params;
        const { status } = req.query;

        if (!ebookId) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Ebook ID is required!'
            });
        }

        const result = await pageService.getPagesByEbook(ebookId, status);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }

    } catch (error) {
        console.log('Get pages by ebook controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching pages'
        });
    }
};

const getPageById = async (req, res) => {
    try {
        console.log('Get page by ID request received:', req.params);

        const { pageId } = req.params;

        if (!pageId) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Page ID is required!'
            });
        }

        const result = await pageService.getPageById(pageId);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }

    } catch (error) {
        console.log('Get page by ID controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching page'
        });
    }
};

const getPageByNumber = async (req, res) => {
    try {
        console.log('Get page by number request received:', req.params);

        const { ebookId, pageNumber } = req.params;

        if (!ebookId || !pageNumber) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Ebook ID and page number are required!'
            });
        }

        const result = await pageService.getPageByNumber(ebookId, pageNumber);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }

    } catch (error) {
        console.log('Get page by number controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching page'
        });
    }
};

const updatePage = async (req, res) => {
    try {
        console.log('Update page request received:', req.params, req.body);

        const { pageId } = req.params;
        const { title, content, imagePath, status } = req.body;

        if (!pageId) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Page ID is required!'
            });
        }

        const result = await pageService.updatePage(pageId, {
            title,
            content,
            imagePath,
            status
        });

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Update page controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during page update'
        });
    }
};

const deletePage = async (req, res) => {
    try {
        console.log('Delete page request received:', req.params);

        const { pageId } = req.params;

        if (!pageId) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Page ID is required!'
            });
        }

        const result = await pageService.deletePage(pageId);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Delete page controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during page deletion'
        });
    }
};

export default {
    createPage,
    getPagesByEbook,
    getPageById,
    getPageByNumber,
    updatePage,
    deletePage
};
