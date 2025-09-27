const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const UserFavouriteType = sequelize.define('UserFavouriteType', {
    userFavouriteTypeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'user_favourite_type_id'
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
    typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'type_id',
        references: {
            model: 'types',
            key: 'type_id'
        }
    }
}, {
    tableName: 'user_favourite_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['type_id']
        },
        {
            unique: true,
            fields: ['user_id', 'type_id']
        }
    ]
});

// Remove individual sync call to prevent deadlocks
// UserFavouriteType.sync({ alter: true });

module.exports = UserFavouriteType;
