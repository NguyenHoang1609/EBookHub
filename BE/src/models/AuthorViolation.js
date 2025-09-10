const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const AuthorViolation = sequelize.define('AuthorViolation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    ebookId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'ebook_id',
        references: {
            model: 'ebooks',
            key: 'ebook_id'
        }
    },
    reportedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'reported_by',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('copyright', 'plagiarism', 'abuse', 'spam', 'other'),
        allowNull: false,
        defaultValue: 'other'
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('open', 'under_review', 'resolved', 'dismissed'),
        allowNull: false,
        defaultValue: 'open'
    },
    actionTaken: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'action_taken'
    }
}, {
    tableName: 'author_violations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['author_id'] },
        { fields: ['ebook_id'] },
        { fields: ['reported_by'] },
        { fields: ['status'] },
        { fields: ['type'] }
    ]
});

module.exports = AuthorViolation;


