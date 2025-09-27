const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const Type = sequelize.define('Type', {
    typeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'type_id'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [1, 255]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['name']
        },
        {
            fields: ['is_active']
        }
    ]
});

// Remove individual sync call to prevent deadlocks
// Type.sync({ alter: true });

module.exports = Type;
