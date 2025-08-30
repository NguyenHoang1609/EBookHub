const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sender_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'receiver_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'book_id',
        references: {
            model: 'ebooks',
            key: 'ebook_id'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_read'
    },
    type: {
        type: DataTypes.ENUM('system', 'user', 'admin', 'payment', 'review'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['sender_id']
        },
        {
            fields: ['receiver_id']
        },
        {
            fields: ['book_id']
        },
        {
            fields: ['is_read']
        },
        {
            fields: ['type']
        },
        {
            fields: ['created_at']
        }
    ]
});

module.exports = Notification;
