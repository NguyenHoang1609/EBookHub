import typeService from '../serivces/typeService';

// Get all types with pagination and filtering
const getAllTypes = async (req, res) => {
    try {
        console.log('Get all types request received');

        const { page = 0, pageSize = 100, search, isActive, sortBy = 'name', sortOrder = 'ASC' } = req.query;

        const result = await typeService.getAllTypes({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            search,
            isActive: isActive !== undefined ? isActive === 'true' : true,
            sortBy,
            sortOrder: sortOrder.toUpperCase()
        });

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Get all types controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching types'
        });
    }
};

// Get type by ID
const getTypeById = async (req, res) => {
    try {
        console.log('Get type by ID request received:', req.params.id);

        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            });
        }

        const result = await typeService.getTypeById(parseInt(id));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }

    } catch (error) {
        console.log('Get type by ID controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching type'
        });
    }
};

// Create new type
const createType = async (req, res) => {
    try {
        console.log('Create type request received:', req.body);

        const { name, description, isActive } = req.body;

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Type name is required!'
            });
        }

        const result = await typeService.createType({
            name: name.trim(),
            description: description?.trim(),
            isActive
        });

        if (result.EC === 0) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Create type controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while creating type'
        });
    }
};

// Update type
const updateType = async (req, res) => {
    try {
        console.log('Update type request received:', req.params.id, req.body);

        const { id } = req.params;
        const { name, description, isActive } = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            });
        }

        const result = await typeService.updateType(parseInt(id), {
            name: name?.trim(),
            description: description?.trim(),
            isActive
        });

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Update type controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while updating type'
        });
    }
};

// Delete type
const deleteType = async (req, res) => {
    try {
        console.log('Delete type request received:', req.params.id);

        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            });
        }

        const result = await typeService.deleteType(parseInt(id));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Delete type controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while deleting type'
        });
    }
};

// Get user's favourite types
const getUserFavouriteTypes = async (req, res) => {
    try {
        console.log('Get user favourite types request received:', req.params.userId);

        const { userId } = req.params;

        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            });
        }

        const result = await typeService.getUserFavouriteTypes(parseInt(userId));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }

    } catch (error) {
        console.log('Get user favourite types controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching user favourite types'
        });
    }
};

// Add favourite type for user
const addUserFavouriteType = async (req, res) => {
    try {
        console.log('Add user favourite type request received:', req.params.userId, req.body);

        const { userId } = req.params;
        const { typeId } = req.body;

        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            });
        }

        if (!typeId || isNaN(parseInt(typeId))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            });
        }

        const result = await typeService.addUserFavouriteType(parseInt(userId), parseInt(typeId));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Add user favourite type controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while adding favourite type'
        });
    }
};

// Remove favourite type for user
const removeUserFavouriteType = async (req, res) => {
    try {
        console.log('Remove user favourite type request received:', req.params.userId, req.params.typeId);

        const { userId, typeId } = req.params;

        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid user ID provided!'
            });
        }

        if (!typeId || isNaN(parseInt(typeId))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            });
        }

        const result = await typeService.removeUserFavouriteType(parseInt(userId), parseInt(typeId));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Remove user favourite type controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while removing favourite type'
        });
    }
};

// Get ebooks by type
const getEbooksByType = async (req, res) => {
    try {
        console.log('Get ebooks by type request received:', req.params.typeId);

        const { typeId } = req.params;
        const { page = 0, pageSize = 10, status } = req.query;

        if (!typeId || isNaN(parseInt(typeId))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid type ID provided!'
            });
        }

        const result = await typeService.getEbooksByType(parseInt(typeId), {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            status
        });

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }

    } catch (error) {
        console.log('Get ebooks by type controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching ebooks by type'
        });
    }
};

// Add types to ebook
const addTypesToEbook = async (req, res) => {
    try {
        console.log('Add types to ebook request received:', req.params.ebookId, req.body);

        const { ebookId } = req.params;
        const { typeIds } = req.body;

        if (!ebookId || isNaN(parseInt(ebookId))) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Invalid ebook ID provided!'
            });
        }

        if (!Array.isArray(typeIds) || typeIds.length === 0) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Type IDs array is required!'
            });
        }

        const result = await typeService.addTypesToEbook(parseInt(ebookId), typeIds);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Add types to ebook controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while adding types to ebook'
        });
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
