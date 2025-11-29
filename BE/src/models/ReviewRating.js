const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const ReviewRating = sequelize.define('ReviewRating', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    reviewText: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'review_text'
    }
}, {
    tableName: 'review_ratings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['ebook_id', 'user_id']
        },
        {
            fields: ['ebook_id']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['rating']
        }
    ]
});
// ReviewRating.sync({alter:true})

module.exports = ReviewRating;
