const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const SavedPage = sequelize.define('SavedPage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'book_id',
        references: {
            model: 'ebooks',
            key: 'ebook_id'
        }
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
    numberPage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'number_page',
        validate: {
            min: 1
        }
    }
}, {
    tableName: 'saved_pages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['book_id', 'user_id']
        },
        {
            fields: ['user_id']
        }
    ]
});

module.exports = SavedPage;
