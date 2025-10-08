const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255]
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    phone: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 255]
        }
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3,
        field: 'group_id',
        references: {
            model: 'groups',
            key: 'id'
        }
    },
    avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
        field: 'avatar'
    },
    isVip: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_vip'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

// Remove individual sync call to prevent deadlocks
// User.sync({ alter: true });

module.exports = User;
