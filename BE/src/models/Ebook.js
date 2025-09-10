const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const Ebook = sequelize.define('Ebook', {
    ebookId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'ebook_id'
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'author_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 500]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    filePath: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'file_path',
        defaultValue: ''
    },
    viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'view_count',
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived', 'pending_review'),
        allowNull: false,
        defaultValue: 'draft'
    },
    coverImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'cover_image'
    }
}, {
    tableName: 'ebooks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['author_id']
        },
        {
            fields: ['status']
        },
        {
            fields: ['title']
        }
    ]
});

// Remove individual sync call to prevent deadlocks
// Ebook.sync({ alter: true });

module.exports = Ebook;
