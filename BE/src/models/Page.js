const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const Page = sequelize.define('Page', {
    pageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'page_id'
    },
    ebookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ebook_id',
        references: {
            model: 'ebooks',
            key: 'ebook_id'
        }
    },
    pageNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'page_number',
        validate: {
            min: 1
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: [0, 255]
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: 'content'
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft'
    }
}, {
    tableName: 'pages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['ebook_id']
        },
        {
            fields: ['page_number']
        },
        {
            fields: ['status']
        },
        {
            unique: true,
            fields: ['ebook_id', 'page_number']
        }
    ]
});

// Remove individual sync call to prevent deadlocks
// Page.sync({ alter: true });

module.exports = Page;
