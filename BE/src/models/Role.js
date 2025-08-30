const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    URL: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'url',
        validate: {
            notEmpty: true,
            len: [1, 500]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    method: {
        type: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH'),
        allowNull: false,
        defaultValue: 'GET'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['url', 'method']
        },
        {
            fields: ['method']
        },
        {
            fields: ['is_active']
        }
    ]
});

module.exports = Role;
