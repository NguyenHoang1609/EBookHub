const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const EbookType = sequelize.define('EbookType', {
    ebookTypeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'ebook_type_id'
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
    tableName: 'ebook_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['ebook_id']
        },
        {
            fields: ['type_id']
        },
        {
            unique: true,
            fields: ['ebook_id', 'type_id']
        }
    ]
});

// Remove individual sync call to prevent deadlocks
// EbookType.sync({ alter: true });

module.exports = EbookType;
