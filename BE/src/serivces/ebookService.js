import db from '../models';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import pageService from './pageService';
import { promises as fsPromises } from 'fs';
import convertPdfToText from './pdfConverter';

const validatePdfFile = (pdfPath) => {
    try {
        if (!fs.existsSync(pdfPath)) {
            return { isValid: false, error: 'File does not exist' };
        }

        const stats = fs.statSync(pdfPath);
        const fileSizeInMB = stats.size / (1024 * 1024);

        if (fileSizeInMB === 0) {
            return { isValid: false, error: 'File is empty' };
        }

        if (fileSizeInMB > 50) {
            return { isValid: false, error: 'File size exceeds 50MB limit' };
        }

        try {
            fs.accessSync(pdfPath, fs.constants.R_OK);
        } catch (accessError) {
            return { isValid: false, error: 'File is not readable' };
        }

        const buffer = Buffer.alloc(4);
        const fd = fs.openSync(pdfPath, 'r');
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);

        const header = buffer.toString('ascii');
        if (header !== '%PDF') {
            return { isValid: false, error: 'File does not appear to be a valid PDF' };
        }

        return { isValid: true };
    } catch (error) {
        return { isValid: false, error: `File validation failed: ${error.message}` };
    }
};

const createEbook = async (ebookData) => {
    try {
        const { authorId, title, description, status } = ebookData;

        if (!authorId || !title) {
            return {
                DT: '',
                EC: -1,
                EM: 'Missing required fields: authorId and title are required!'
            };
        }

        const author = await db.User.findByPk(authorId);
        if (!author) {
            return {
                DT: '',
                EC: -1,
                EM: 'Author not found!'
            };
        }

        const ebook = await db.Ebook.create({
            authorId,
            title,
            description,
            status: status || 'draft'
        });

        return {
            DT: ebook,
            EC: 0,
            EM: 'Ebook created successfully!'
        };

    } catch (error) {
        console.log('Create ebook error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to create ebook!'
        };
    }
};

const uploadEbook = async (uploadData) => {
    const transaction = await db.sequelize.transaction();
    let ebook = null;
    let ebookDir = null;

    try {
        const { authorId, title, description, status, pdfPath, originalName, coverImagePath } = uploadData;
        console.log('Upload data received:', { authorId, title, originalName, pdfPath: pdfPath ? 'exists' : 'missing', coverImagePath: coverImagePath ? 'exists' : 'missing' });

        if (!authorId || !title || !pdfPath) {
            await transaction.rollback();
            return {
                DT: '',
                EC: -1,
                EM: 'Missing required fields: authorId, title, and PDF file are required!'
            };
        }

        const validation = validatePdfFile(pdfPath);
        if (!validation.isValid) {
            await transaction.rollback();
            return {
                DT: '',
                EC: -1,
                EM: validation.error
            };
        }

        const author = await db.User.findByPk(authorId);
        if (!author) {
            await transaction.rollback();
            return {
                DT: '',
                EC: -1,
                EM: 'Author not found!'
            };
        }

        console.log("Creating ebook record...");

        ebook = await db.Ebook.create({
            authorId,
            title,
            description,
            file_path: pdfPath || '',
            viewCount: 0,
            status: status || 'draft'
        }, { transaction });

        console.log("Ebook record created with ID:", ebook.ebookId);

        ebookDir = path.join(process.cwd(), 'public', 'ebook', `book_${ebook.ebookId}`);
        if (!fs.existsSync(ebookDir)) {
            fs.mkdirSync(ebookDir, { recursive: true });
        }

        console.log("Converting PDF to text...");

        const convertResult = await convertPdfToText(pdfPath, uploadData.password);

        if (!convertResult || convertResult.length === 0) {
            throw new Error('Failed to extract text from PDF - no content found');
        }

        console.log(`Successfully extracted ${convertResult.length} text pages from PDF`);

        console.log("Creating page records...");

        const pages = [];
        for (let i = 0; i < convertResult.length; i++) {
            const pageData = convertResult[i];

            const page = await db.Page.create({
                ebookId: ebook.ebookId,
                pageNumber: pageData.pageNumber,
                title: pageData.title,
                content: pageData.content,
                status: status || 'draft'
            }, { transaction });

            pages.push(page);
        }

        let finalCoverImagePath = null;
        if (uploadData.coverImagePath && fs.existsSync(uploadData.coverImagePath)) {
            const coverImageName = `cover_${Date.now()}${path.extname(uploadData.coverImagePath)}`;
            const coverImageDest = path.join(ebookDir, coverImageName);

            await fsPromises.copyFile(uploadData.coverImagePath, coverImageDest);
            finalCoverImagePath = `/ebook/book_${ebook.ebookId}/${coverImageName}`;

            console.log("Cover image saved:", finalCoverImagePath);
        }

        if (finalCoverImagePath) {
            await ebook.update({
                coverImage: finalCoverImagePath
            }, { transaction });
        }

        console.log("Cleaning up temporary files...");

        if (fs.existsSync(pdfPath)) {
            try {
                fs.unlinkSync(pdfPath);
                console.log("Temporary PDF file cleaned up");
            } catch (cleanupError) {
                console.warn("Failed to clean up temporary PDF file:", cleanupError);
            }
        }

        if (uploadData.coverImagePath && fs.existsSync(uploadData.coverImagePath)) {
            try {
                fs.unlinkSync(uploadData.coverImagePath);
                console.log("Temporary cover image file cleaned up");
            } catch (cleanupError) {
                console.warn("Failed to clean up temporary cover image file:", cleanupError);
            }
        }

        await transaction.commit();
        console.log("Transaction committed successfully");

        const completeEbook = await db.Ebook.findByPk(ebook.ebookId, {
            include: [
                {
                    model: db.User,
                    as: 'author',
                    attributes: ['id', 'email', 'name']
                },
                {
                    model: db.Page,
                    as: 'pages',
                    order: [['pageNumber', 'ASC']]
                }
            ]
        });

        return {
            DT: {
                ebook: completeEbook,
                pagesCount: pages.length,
                message: `Successfully uploaded ${pages.length} text pages`
            },
            EC: 0,
            EM: 'Ebook uploaded and processed successfully!'
        };

    } catch (error) {
        console.error('Upload ebook error:', error);

        try {
            await transaction.rollback();
            console.log("Transaction rolled back");
        } catch (rollbackError) {
            console.error("Failed to rollback transaction:", rollbackError);
        }

        if (ebook && ebookDir && fs.existsSync(ebookDir)) {
            try {
                fs.rmSync(ebookDir, { recursive: true, force: true });
                console.log("Cleaned up ebook directory on error");
            } catch (cleanupError) {
                console.error("Failed to clean up ebook directory:", cleanupError);
            }
        }

        if (uploadData.pdfPath && fs.existsSync(uploadData.pdfPath)) {
            try {
                fs.unlinkSync(uploadData.pdfPath);
                console.log("Cleaned up temporary PDF file on error");
            } catch (cleanupError) {
                console.error("Failed to clean up temporary PDF file:", cleanupError);
            }
        }

        if (uploadData.coverImagePath && fs.existsSync(uploadData.coverImagePath)) {
            try {
                fs.unlinkSync(uploadData.coverImagePath);
                console.log("Cleaned up temporary cover image file on error");
            } catch (cleanupError) {
                console.error("Failed to clean up temporary cover image file:", cleanupError);
            }
        }

        let errorMessage = 'Failed to upload and process ebook!';
        if (error.message.includes('EOF')) {
            errorMessage = 'File upload interrupted. Please try again with a smaller file or check your connection.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'PDF processing timed out. Please try with a smaller file.';
        } else if (error.message.includes('text')) {
            errorMessage = 'PDF text extraction failed. Please ensure the file contains extractable text.';
        } else if (error.message.includes('password')) {
            errorMessage = 'PDF is password protected. Please provide the correct password.';
        }

        return {
            DT: '',
            EC: -1,
            EM: errorMessage
        };
    }
};

const getAllEbooks = async (queryParams) => {
    try {
        const { page = 1, limit = 10, status, authorId, search } = queryParams;
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (status) {
            whereClause.status = status;
        }

        if (authorId) {
            whereClause.authorId = authorId;
        }

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await db.Ebook.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: db.User,
                    as: 'author',
                    attributes: ['id', 'email', 'name']
                },
                {
                    model: db.Type,
                    as: 'types',
                    through: { attributes: [] },
                    attributes: ['typeId', 'name', 'description']
                }
            ],

            offset,
            limit,
            distinct: true
        });

        return {
            DT: {
                ebooks: rows,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: limit
                }
            },
            EC: 0,
            EM: 'Ebooks retrieved successfully!'
        };

    } catch (error) {
        console.log('Get all ebooks error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve ebooks!'
        };
    }
};

const getEbookById = async (ebookId, includePages = false) => {
    try {
        if (!ebookId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook ID is required!'
            };
        }

        const includeOptions = [
            {
                model: db.User,
                as: 'author',
                attributes: ['id', 'email', 'name']
            },
            {
                model: db.Type,
                as: 'types',
                through: { attributes: [] },
                attributes: ['typeId', 'name', 'description']
            }
        ];

        if (includePages) {
            includeOptions.push({
                model: db.Page,
                as: 'pages',
                order: [['pageNumber', 'ASC']]
            });
        }

        const ebook = await db.Ebook.findByPk(ebookId, {
            include: includeOptions
        });

        if (!ebook) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook not found!'
            };
        }

        await ebook.increment('viewCount');

        return {
            DT: ebook,
            EC: 0,
            EM: 'Ebook retrieved successfully!'
        };

    } catch (error) {
        console.log('Get ebook by ID error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve ebook!'
        };
    }
};

const updateEbook = async (ebookId, updateData) => {
    try {
        const { title, description, status } = updateData;

        if (!ebookId) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook ID is required!'
            };
        }

        const ebook = await db.Ebook.findByPk(ebookId);
        if (!ebook) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook not found!'
            };
        }

        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (status !== undefined) updateFields.status = status;

        await ebook.update(updateFields);

        const updatedEbook = await db.Ebook.findByPk(ebookId, {
            include: [
                {
                    model: db.User,
                    as: 'author',
                    attributes: ['id', 'email', 'name']
                }
            ]
        });

        return {
            DT: updatedEbook,
            EC: 0,
            EM: 'Ebook updated successfully!'
        };

    } catch (error) {
        console.log('Update ebook error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to update ebook!'
        };
    }
};

const deleteEbook = async (ebookId) => {
    const transaction = await db.sequelize.transaction();

    try {
        if (!ebookId) {
            await transaction.rollback();
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook ID is required!'
            };
        }

        const ebook = await db.Ebook.findByPk(ebookId, {
            include: [
                {
                    model: db.Page,
                    as: 'pages'
                }
            ]
        });

        if (!ebook) {
            await transaction.rollback();
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook not found!'
            };
        }

        await db.Page.destroy({
            where: { ebookId },
            transaction
        });

        await ebook.destroy({ transaction });

        const ebookDir = path.join(process.cwd(), 'public', 'ebook', `book_${ebookId}`);
        if (fs.existsSync(ebookDir)) {
            fs.rmSync(ebookDir, { recursive: true, force: true });
        }

        await transaction.commit();

        return {
            DT: '',
            EC: 0,
            EM: 'Ebook and all associated pages deleted successfully!'
        };

    } catch (error) {
        await transaction.rollback();
        console.log('Delete ebook error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to delete ebook!'
        };
    }
};

const getEbookStats = async (authorId = null) => {
    try {
        let whereClause = {};
        if (authorId) {
            whereClause.authorId = authorId;
        }

        const totalEbooks = await db.Ebook.count({ where: whereClause });

        const statusStats = await db.Ebook.findAll({
            where: whereClause,
            attributes: [
                'status',
                [db.sequelize.fn('COUNT', db.sequelize.col('status')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        const totalViews = await db.Ebook.sum('viewCount', { where: whereClause }) || 0;

        const totalPages = await db.Page.count({
            include: [{
                model: db.Ebook,
                as: 'ebook',
                where: whereClause,
                attributes: []
            }]
        });

        return {
            DT: {
                totalEbooks,
                totalViews,
                totalPages,
                statusBreakdown: statusStats.reduce((acc, stat) => {
                    acc[stat.status] = parseInt(stat.count);
                    return acc;
                }, {}),
                averagePagesPerBook: totalEbooks > 0 ? Math.round(totalPages / totalEbooks) : 0
            },
            EC: 0,
            EM: 'Ebook statistics retrieved successfully!'
        };

    } catch (error) {
        console.log('Get ebook stats error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve ebook statistics!'
        };
    }
};

const getTopBooks = async (limit = 10) => {
    try {
        const ebooks = await db.Ebook.findAll({
            where: {
                status: 'published'
            },
            include: [
                {
                    model: db.User,
                    as: 'author',
                    attributes: ['id', 'email', 'name']
                },
                {
                    model: db.Type,
                    as: 'types',
                    through: { attributes: [] },
                    attributes: ['typeId', 'name', 'description']
                }
            ],
            order: [['viewCount', 'DESC']],
            limit: parseInt(limit)
        });

        return {
            DT: {
                ebooks: ebooks,
                totalItems: ebooks.length
            },
            EC: 0,
            EM: 'Top books retrieved successfully!'
        };

    } catch (error) {
        console.log('Get top books error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve top books!'
        };
    }
};

const getFavouriteBooks = async (userId, limit = 10) => {
    try {
        if (!userId) {
            return {
                DT: '',
                EC: -1,
                EM: 'User ID is required!'
            };
        }

        // First, get user's favourite types
        const userFavouriteTypes = await db.UserFavouriteType.findAll({
            where: { userId: parseInt(userId) },
            include: [
                {
                    model: db.Type,
                    as: 'type',
                    attributes: ['typeId', 'name']
                }
            ]
        });

        if (userFavouriteTypes.length === 0) {
            return {
                DT: {
                    ebooks: [],
                    totalItems: 0,
                    message: 'No favourite types found for user'
                },
                EC: 0,
                EM: 'No favourite types found for user!'
            };
        }

        const favouriteTypeIds = userFavouriteTypes.map(uf => uf.typeId);

        // Get ebooks that match user's favourite types
        const ebooks = await db.Ebook.findAll({
            where: {
                status: 'published'
            },
            include: [
                {
                    model: db.User,
                    as: 'author',
                    attributes: ['id', 'email', 'name']
                },
                {
                    model: db.Type,
                    as: 'types',
                    through: { attributes: [] },
                    where: {
                        typeId: {
                            [Op.in]: favouriteTypeIds
                        }
                    },
                    attributes: ['typeId', 'name', 'description'],
                    required: true
                }
            ],
            order: [['viewCount', 'DESC']],
            limit: parseInt(limit),
            distinct: true
        });

        return {
            DT: {
                ebooks: ebooks,
                totalItems: ebooks.length,
                favouriteTypes: userFavouriteTypes.map(uf => ({
                    typeId: uf.type.typeId,
                    name: uf.type.name
                }))
            },
            EC: 0,
            EM: 'Favourite books retrieved successfully!'
        };

    } catch (error) {
        console.log('Get favourite books error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Failed to retrieve favourite books!'
        };
    }
};

export default {
    createEbook,
    uploadEbook,
    getAllEbooks,
    getEbookById,
    updateEbook,
    deleteEbook,
    getEbookStats,
    getTopBooks,
    getFavouriteBooks
};
