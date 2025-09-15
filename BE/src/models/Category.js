const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const Category = sequelize.define('Category', {
    CategoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'Category_id'
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'category',

    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,

    },

}, {
    tableName: 'Categorys',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

});

// Remove individual sync call to prevent deadlocks
// Category.sync({ alter: true });

module.exports = Category;
