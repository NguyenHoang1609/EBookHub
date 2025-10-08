const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const ContentModeration = sequelize.define('ContentModeration', {
    moderationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'moderation_id'
    },
    word: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [1, 255]
        }
    },
    severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium'
    },
    category: {
        type: DataTypes.ENUM('profanity', 'violence', 'hate_speech', 'sexual', 'spam', 'political', 'religious', 'other'),
        allowNull: false,
        defaultValue: 'other'
    },
    language: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'vi',
        validate: {
            len: [2, 10]
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'created_by',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'updated_by',
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'content_moderation',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['word'],
            unique: true
        },
        {
            fields: ['severity']
        },
        {
            fields: ['category']
        },
        {
            fields: ['language']
        },
        {
            fields: ['is_active']
        },
        {
            fields: ['created_by']
        }
    ]
});

// ContentModeration.sync({alter:true})

module.exports = ContentModeration;
