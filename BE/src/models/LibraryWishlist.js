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

}, {
    tableName: 'library_wishlists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['ebook_id']
        },
        {
            unique: true,
            fields: ['user_id', 'ebook_id']
        },
    ]
});

// LibraryWishlist.sync({ alter: true });

module.exports = LibraryWishlist;
