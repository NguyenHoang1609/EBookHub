import db from '../models';
import { Op } from 'sequelize';

// Get all types with pagination and filtering
const getAllTypes = async (options = {}) => {
    try {
        const {
            page = 0,
            pageSize = 10,
            search,
            isActive = true,
            sortBy = 'name',
            sortOrder = 'ASC'
        } = options;

        const offset = page * pageSize;
        const limit = pageSize;

        // Build where clause
        const whereClause = {};

        if (isActive !== null && isActive !== undefined) {
            whereClause.isActive = isActive;
        }

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await db.Type.findAndCountAll({
            where: whereClause,
            order: [[sortBy, sortOrder.toUpperCase()]],
            limit,
            offset,
            distinct: true
        });

        return {
            DT: {
                types: rows,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalItems: count,
                    totalPages: Math.ceil(count / pageSize),
                    hasNextPage: page < Math.ceil(count / pageSize) - 1,
                    hasPrevPage: page > 0
                }
            },
            EC: 0,
            EM: 'Types retrieved successfully'
        };

    } catch (error) {
        console.log('Get all types service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching types'
        };
    }
};

// Get type by ID
const getTypeById = async (typeId) => {
    try {
        if (!typeId || isNaN(parseInt(typeId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            };
        }

        const type = await db.Type.findByPk(parseInt(typeId), {
            include: [
                {
                    model: db.Ebook,
                    as: 'ebooks',
                    through: { attributes: [] },
                    attributes: ['ebookId', 'title', 'status']
                }
            ]
        });

        if (!type) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type not found!'
            };
        }

        return {
            DT: type,
            EC: 0,
            EM: 'Type retrieved successfully'
        };

    } catch (error) {
        console.log('Get type by ID service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching type'
        };
    }
};

// Create new type
const createType = async (typeData) => {
    try {
        const { name, description, isActive = true } = typeData;

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type name is required!'
            };
        }

        // Check if type name already exists
        const existingType = await db.Type.findOne({
            where: { name: name.trim() }
        });

        if (existingType) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type with this name already exists!'
            };
        }

        const newType = await db.Type.create({
            name: name.trim(),
            description: description?.trim() || null,
            isActive
        });

        return {
            DT: newType,
            EC: 0,
            EM: 'Type created successfully'
        };

    } catch (error) {
        console.log('Create type service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while creating type'
        };
    }
};

// Update type
const updateType = async (typeId, typeData) => {
    try {
        if (!typeId || isNaN(parseInt(typeId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            };
        }

        const { name, description, isActive } = typeData;

        const type = await db.Type.findByPk(parseInt(typeId));

        if (!type) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type not found!'
            };
        }

        // Check if new name conflicts with existing type
        if (name && name.trim() !== type.name) {
            const existingType = await db.Type.findOne({
                where: {
                    name: name.trim(),
                    typeId: { [Op.ne]: parseInt(typeId) }
                }
            });

            if (existingType) {
                return {
                    DT: '',
                    EC: -1,
                    EM: 'Type with this name already exists!'
                };
            }
        }

        // Update fields
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;
        if (isActive !== undefined) updateData.isActive = isActive;

        await type.update(updateData);

        return {
            DT: type,
            EC: 0,
            EM: 'Type updated successfully'
        };

    } catch (error) {
        console.log('Update type service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while updating type'
        };
    }
};

// Delete type
const deleteType = async (typeId) => {
    try {
        if (!typeId || isNaN(parseInt(typeId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            };
        }

        const type = await db.Type.findByPk(parseInt(typeId));

        if (!type) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type not found!'
            };
        }

        // Check if type is being used by any ebooks
        const ebookCount = await db.EbookType.count({
            where: { typeId: parseInt(typeId) }
        });

        if (ebookCount > 0) {
            return {
                DT: '',
                EC: -1,
                EM: `Cannot delete type. It is currently used by ${ebookCount} ebook(s). Please remove the associations first.`
            };
        }

        await type.destroy();

        return {
            DT: '',
            EC: 0,
            EM: 'Type deleted successfully'
        };

    } catch (error) {
        console.log('Delete type service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while deleting type'
        };
    }
};

// Get user's favourite types
const getUserFavouriteTypes = async (userId) => {
    try {
        if (!userId || isNaN(parseInt(userId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            };
        }

        const user = await db.User.findByPk(parseInt(userId), {
            include: [
                {
                    model: db.Type,
                    as: 'favouriteTypes',
                    through: { attributes: [] },
                    where: { isActive: true },
                    required: false
                }
            ]
        });

        if (!user) {
            return {
                DT: '',
                EC: -1,
                EM: 'User not found!'
            };
        }

        return {
            DT: user.favouriteTypes,
            EC: 0,
            EM: 'User favourite types retrieved successfully'
        };

    } catch (error) {
        console.log('Get user favourite types service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching user favourite types'
        };
    }
};

// Add favourite type for user
const addUserFavouriteType = async (userId, typeId) => {
    try {
        if (!userId || isNaN(parseInt(userId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            };
        }

        if (!typeId || isNaN(parseInt(typeId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            };
        }

        // Check if user exists
        const user = await db.User.findByPk(parseInt(userId));
        if (!user) {
            return {
                DT: '',
                EC: -1,
                EM: 'User not found!'
            };
        }

        // Check if type exists and is active
        const type = await db.Type.findOne({
            where: {
                typeId: parseInt(typeId),
                isActive: true
            }
        });

        if (!type) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type not found or inactive!'
            };
        }

        // Check if already favourited
        const existingFavourite = await db.UserFavouriteType.findOne({
            where: {
                userId: parseInt(userId),
                typeId: parseInt(typeId)
            }
        });

        if (existingFavourite) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type is already in user\'s favourites!'
            };
        }

        // Add to favourites
        await db.UserFavouriteType.create({
            userId: parseInt(userId),
            typeId: parseInt(typeId)
        });

        return {
            DT: '',
            EC: 0,
            EM: 'Type added to favourites successfully'
        };

    } catch (error) {
        console.log('Add user favourite type service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while adding favourite type'
        };
    }
};

// Remove favourite type for user
const removeUserFavouriteType = async (userId, typeId) => {
    try {
        if (!userId || isNaN(parseInt(userId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            };
        }

        if (!typeId || isNaN(parseInt(typeId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            };
        }

        const favouriteType = await db.UserFavouriteType.findOne({
            where: {
                userId: parseInt(userId),
                typeId: parseInt(typeId)
            }
        });

        if (!favouriteType) {
            return {
                DT: '',
                EC: -1,
                EM: 'Favourite type not found!'
            };
        }

        await favouriteType.destroy();

        return {
            DT: '',
            EC: 0,
            EM: 'Type removed from favourites successfully'
        };

    } catch (error) {
        console.log('Remove user favourite type service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while removing favourite type'
        };
    }
};

// Get ebooks by type
const getEbooksByType = async (typeId, options = {}) => {
    try {
        if (!typeId || isNaN(parseInt(typeId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            };
        }

        const {
            page = 0,
            pageSize = 10,
            status = 'published'
        } = options;

        const offset = page * pageSize;
        const limit = pageSize;

        const type = await db.Type.findByPk(parseInt(typeId), {
            include: [
                {
                    model: db.Ebook,
                    as: 'ebooks',
                    through: { attributes: [] },
                    where: status ? { status } : {},
                    include: [
                        {
                            model: db.User,
                            as: 'author',
                            attributes: ['id', 'name', 'avatar']
                        }
                    ],
                    limit,
                    offset,
                    order: [['createdAt', 'DESC']]
                }
            ]
        });

        if (!type) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type not found!'
            };
        }

        // Get total count
        const totalCount = await db.EbookType.count({
            where: { typeId: parseInt(typeId) },
            include: [
                {
                    model: db.Ebook,
                    as: 'ebook',
                    where: status ? { status } : {}
                }
            ]
        });

        return {
            DT: {
                type: {
                    typeId: type.typeId,
                    name: type.name,
                    description: type.description
                },
                ebooks: type.ebooks,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalItems: totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                    hasNextPage: page < Math.ceil(totalCount / pageSize) - 1,
                    hasPrevPage: page > 0
                }
            },
            EC: 0,
            EM: 'Ebooks by type retrieved successfully'
        };

    } catch (error) {
        console.log('Get ebooks by type service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching ebooks by type'
        };
    }
};

// Add types to ebook
const addTypesToEbook = async (ebookId, typeIds) => {
    try {
        if (!ebookId || isNaN(parseInt(ebookId))) {
            return {
                DT: '',
                EC: -1,
                EM: 'Invalid ebook ID provided!'
            };
        }

        if (!Array.isArray(typeIds) || typeIds.length === 0) {
            return {
                DT: '',
                EC: -1,
                EM: 'Type IDs array is required!'
            };
        }

        // Validate ebook exists
        const ebook = await db.Ebook.findByPk(parseInt(ebookId));
        if (!ebook) {
            return {
                DT: '',
                EC: -1,
                EM: 'Ebook not found!'
            };
        }

        // Validate all types exist and are active
        const types = await db.Type.findAll({
            where: {
                typeId: { [Op.in]: typeIds.map(id => parseInt(id)) },
                isActive: true
            }
        });

        if (types.length !== typeIds.length) {
            return {
                DT: '',
                EC: -1,
                EM: 'One or more types not found or inactive!'
            };
        }

        // Remove existing associations
        await db.EbookType.destroy({
            where: { ebookId: parseInt(ebookId) }
        });

        // Add new associations
        const associations = typeIds.map(typeId => ({
            ebookId: parseInt(ebookId),
            typeId: parseInt(typeId)
        }));

        await db.EbookType.bulkCreate(associations);

        return {
            DT: '',
            EC: 0,
            EM: 'Types added to ebook successfully'
        };

    } catch (error) {
        console.log('Add types to ebook service error:', error);
        return {
            DT: '',
            EC: -1,
            EM: 'Internal server error while adding types to ebook'
        };
    }
};

export default {
    getAllTypes,
    getTypeById,
    createType,
    updateType,
    deleteType,
    getUserFavouriteTypes,
    addUserFavouriteType,
    removeUserFavouriteType,
    getEbooksByType,
    addTypesToEbook
};
