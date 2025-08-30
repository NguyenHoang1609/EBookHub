const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const GroupRole = sequelize.define('GroupRole', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'group_id',
        references: {
            model: 'groups',
            key: 'id'
        }
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'role_id',
        references: {
            model: 'roles',
            key: 'id'
        }
    }
}, {
    tableName: 'group_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['group_id', 'role_id']
        },
        {
            fields: ['group_id']
        },
        {
            fields: ['role_id']
        }
    ]
});

module.exports = GroupRole;
