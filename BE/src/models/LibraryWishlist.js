const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const LibraryWishlist = sequelize.define('LibraryWishlist', {
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
    type: {
        type: DataTypes.ENUM('library', 'wishlist'),
        allowNull: false,
        defaultValue: 'wishlist'
    }
}, {
    tableName: 'library_wishlists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'ebook_id', 'type']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['ebook_id']
        },
        {
            fields: ['type']
        }
    ]
});

module.exports = LibraryWishlist;
