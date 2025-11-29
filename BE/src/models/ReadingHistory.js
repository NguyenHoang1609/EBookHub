const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const ReadingHistory = sequelize.define('ReadingHistory', {
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
    lastReadAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'last_read_at',
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'reading_histories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['ebook_id'] },
        { unique: true, fields: ['user_id', 'ebook_id'] }
    ]
});
// ReadingHistory.sync({ alter: true })
module.exports = ReadingHistory;


