const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
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
    parentCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_comment_id',
        references: {
            model: 'comments',
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 2000]
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['ebook_id']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['parent_comment_id']
        },
        {
            fields: ['created_at']
        }
    ]
});

module.exports = Comment;
