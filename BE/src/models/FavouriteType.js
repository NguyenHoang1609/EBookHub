const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const FavouriteType = sequelize.define('FavouriteType', {
    favouriteTypeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'favouriteType_id'
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
    type: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'type',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

}, {
    tableName: 'favouriteTypes',
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

// Remove individual sync call to prevent deadlocks
// FavouriteType.sync({ alter: true });

module.exports = FavouriteType;
