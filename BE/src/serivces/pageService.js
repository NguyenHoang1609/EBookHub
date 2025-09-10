import db from '../models';
import { Op } from 'sequelize';

const createPage = async (pageData, transaction = null) => {
    try {
        const { ebookId, pageNumber, title, content, status } = pageData;

        if (!ebookId || !pageNumber || !content) {
            return {
                DT: '',
                EC: -1,
                EM: 'Missing required fields: ebookId, pageNumber, and content are required!'
            };
        }

        // Check if ebook exists
        const ebook = await db.Ebook.findByPk(ebookId, { transaction });
        if (!ebook) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook not found!'
            };
        }

        // Check if page number already exists for this ebook
        const existingPage = await db.Page.findOne({
            where: {
                ebookId,
                pageNumber
            },
            transaction
        });

        if (existingPage) {
            return {
                DT: '',
                EC: -1,
                EM: 'Page number already exists for this ebook!'
            };
        }

        const page = await db.Page.create({
            ebookId,
            pageNumber,
            title,
            content,

            status: status || 'draft'
        }, { transaction });

        return {
            DT: page,
            EC: 0,
            EM: 'Page created successfully!'
        };

    } catch (error) {
        console.log('Create page error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to create page!'
        };
    }
};

const getPagesByEbook = async (ebookId, status = 'published') => {
    try {
        if (!ebookId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook ID is required!'
            };
        }

        const pages = await db.Page.findAll({
            where: {
                ebookId,
                status
            },
            order: [['pageNumber', 'ASC']],
            include: [{
                model: db.Ebook,
                as: 'ebook',
                attributes: ['ebookId', 'title']
            }]
        });

        return {
            DT: pages,
            EC: 0,
            EM: 'Pages retrieved successfully!'
        };

    } catch (error) {
        console.log('Get pages by ebook error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve pages!'
        };
    }
};

const getPageById = async (pageId) => {
    try {
        if (!pageId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Page ID is required!'
            };
        }

        const page = await db.Page.findByPk(pageId, {
            include: [{
                model: db.Ebook,
                as: 'ebook',
                attributes: ['ebookId', 'title']
            }]
        });

        if (!page) {
            return {
                DT: '',
                EC: -1,
                EM: 'Page not found!'
            };
        }

        return {
            DT: page,
            EC: 0,
            EM: 'Page retrieved successfully!'
        };

    } catch (error) {
        console.log('Get page by ID error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve page!'
        };
    }
};

const updatePage = async (pageId, updateData) => {
    try {
        const { title, content, status } = updateData;

        if (!pageId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Page ID is required!'
            };
        }

        const page = await db.Page.findByPk(pageId);
        if (!page) {
            return {
                DT: '',
                EC: -1,
                EM: 'Page not found!'
            };
        }

        // Update only provided fields
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (content !== undefined) updateFields.content = content;
        if (status !== undefined) updateFields.status = status;

        await page.update(updateFields);

        return {
            DT: page,
            EC: 0,
            EM: 'Page updated successfully!'
        };

    } catch (error) {
        console.log('Update page error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to update page!'
        };
    }
};

const deletePage = async (pageId) => {
    try {
        if (!pageId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Page ID is required!'
            };
        }

        const page = await db.Page.findByPk(pageId);
        if (!page) {
            return {
                DT: '',
                EC: -1,
                EM: 'Page not found!'
            };
        }

        await page.destroy();

        return {
            DT: '',
            EC: 0,
            EM: 'Page deleted successfully!'
        };

    } catch (error) {
        console.log('Delete page error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to delete page!'
        };
    }
};

const getPageByNumber = async (ebookId, pageNumber) => {
    try {
        if (!ebookId || !pageNumber) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook ID and page number are required!'
            };
        }

        const page = await db.Page.findOne({
            where: {
                ebookId,
                pageNumber,
                status: 'published'
            },
            include: [{
                model: db.Ebook,
                as: 'ebook',
                attributes: ['ebookId', 'title']
            }]
        });

        if (!page) {
            return {
                DT: '',
                EC: -1,
                EM: 'Page not found!'
            };
        }

        return {
            DT: page,
            EC: 0,
            EM: 'Page retrieved successfully!'
        };

    } catch (error) {
        console.log('Get page by number error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve page!'
        };
    }
};

const createPagesFromPDF = async (ebookId, pagesData, transaction = null) => {
    try {
        if (!ebookId || !Array.isArray(pagesData) || pagesData.length === 0) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook ID and pages data are required!'
            };
        }

        const pages = [];
        for (let i = 0; i < pagesData.length; i++) {
            const pageData = pagesData[i];
            const page = await db.Page.create({
                ebookId,
                pageNumber: i + 1,
                title: pageData.title || `Page ${i + 1}`,
                content: pageData.content || `Content for page ${i + 1}`,
                status: pageData.status || 'draft'
            }, { transaction });

            pages.push(page);
        }

        return {
            DT: pages,
            EC: 0,
            EM: `Successfully created ${pages.length} pages!`
        };

    } catch (error) {
        console.log('Create pages from PDF error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to create pages from PDF!'
        };
    }
};

export default {
    createPage,
    getPagesByEbook,
    getPageById,
    updatePage,
    deletePage,
    getPageByNumber,
    createPagesFromPDF
};
