import ebookService from '../serivces/ebookService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const tempDir = path.join(process.cwd(), 'public', 'ebook', 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Configure multer for multiple files (PDF + cover image)
const multipleFileFilter = (req, file, cb) => {
    if (file.fieldname === 'pdfFile' && file.mimetype === 'application/pdf') {
        cb(null, true);
    } else if (file.fieldname === 'coverImage' && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! PDF files and images are allowed.'), false);
    }
};

const uploadMultiple = multer({
    storage: storage,
    fileFilter: multipleFileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit per file
    }
});

const createEbook = async (req, res) => {
    try {
        console.log('Create ebook request received:', req.body);

        const { authorId, title, description, status, isVipEbook } = req.body;

        if (!authorId || !title) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Missing required fields: authorId and title are required!'
            });
        }

        const result = await ebookService.createEbook({
            authorId,
            title,
            description,
            status,
            isVipEbook
        });

        if (result.EC === 0) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Create ebook controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during ebook creation'
        });
    }
};

const uploadEbook = async (req, res) => {
    try {
        console.log('Upload ebook request received:', req.body, req.files);

        if (!req.files || !req.files.pdfFile) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'PDF file is required!'
            });
        }

        // Check if PDF file was actually saved
        if (!req.files.pdfFile[0].path || !fs.existsSync(req.files.pdfFile[0].path)) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Failed to save uploaded PDF file!'
            });
        }

        const { authorId, title, description, status, isVipEbook } = req.body;

        if (!authorId || !title) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Missing required fields: authorId and title are required!'
            });
        }

        // Prepare upload data
        const uploadData = {
            authorId,
            title,
            description,
            status,
            pdfPath: req.files.pdfFile[0].path,
            originalName: req.files.pdfFile[0].originalname,
            isVipEbook
        };

        // Add cover image if provided
        if (req.files.coverImage && req.files.coverImage[0]) {
            uploadData.coverImagePath = req.files.coverImage[0].path;
        }

        const result = await ebookService.uploadEbook(uploadData);

        if (result.EC === 0) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Upload ebook controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during ebook upload'
        });
    }
};

const getAllEbooks = async (req, res) => {
    try {
        console.log('Get all ebooks request received:', req.query);

        const { page = 1, limit = 10, status, authorId, search, typeId } = req.query;

        const result = await ebookService.getAllEbooks({
            page: parseInt(page),
            limit: parseInt(limit),
            status,
            authorId,
            search,
            typeId
        });

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Get all ebooks controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching ebooks'
        });
    }
};

const getEbookById = async (req, res) => {
    try {
        console.log('Get ebook by ID request received:', req.params);

        const { ebookId } = req.params;
        const { includePages } = req.query;

        if (!ebookId) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Ebook ID is required!'
            });
        }

        const result = await ebookService.getEbookById(ebookId, includePages === 'true');

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }

    } catch (error) {
        console.log('Get ebook by ID controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching ebook'
        });
    }
};

const updateEbook = async (req, res) => {
    try {
        console.log('Update ebook request received:', req.params, req.body);

        const { ebookId } = req.params;
        const { title, description, status, isVipEbook } = req.body;

        if (!ebookId) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Ebook ID is required!'
            });
        }

        const result = await ebookService.updateEbook(ebookId, {
            title,
            description,
            status,
            isVipEbook
        });

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Update ebook controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during ebook update'
        });
    }
};

const deleteEbook = async (req, res) => {
    try {
        console.log('Delete ebook request received:', req.params);

        const { ebookId } = req.params;

        if (!ebookId) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'Ebook ID is required!'
            });
        }

        const result = await ebookService.deleteEbook(ebookId);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Delete ebook controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error during ebook deletion'
        });
    }
};

const getEbookStats = async (req, res) => {
    try {
        console.log('Get ebook stats request received:', req.query);

        const { authorId } = req.query;

        const result = await ebookService.getEbookStats(authorId);

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Get ebook stats controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching ebook stats'
        });
    }
};

const getTopBooks = async (req, res) => {
    try {
        console.log('Get top books request received:', req.query);

        const { limit = 10 } = req.query;

        const result = await ebookService.getTopBooks(parseInt(limit));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Get top books controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching top books'
        });
    }
};

const getFavouriteBooks = async (req, res) => {
    try {
        console.log('Get favourite books request received:', req.params, req.query);

        const { userId } = req.params;
        const { limit = 10 } = req.query;

        if (!userId) {
            return res.status(400).json({
                DT: '',
                EC: -1,
                EM: 'User ID is required!'
            });
        }

        const result = await ebookService.getFavouriteBooks(parseInt(userId), parseInt(limit));

        if (result.EC === 0) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        console.log('Get favourite books controller error:', error);
        return res.status(500).json({
            DT: '',
            EC: -1,
            EM: 'Internal server error while fetching favourite books'
        });
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
    getFavouriteBooks,
    upload: upload.single('pdfFile'),
    uploadMultiple: uploadMultiple
};

