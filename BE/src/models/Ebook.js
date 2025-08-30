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
        type: DataTypes.STRING(1000),
        allowNull: false,
        field: 'file_path',
        validate: {
            notEmpty: true
        }
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

module.exports = Ebook;
