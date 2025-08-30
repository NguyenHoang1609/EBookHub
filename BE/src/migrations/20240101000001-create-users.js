'use strict';

module.exports = {

    // tao bang
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,  //check loi trong
                autoIncrement: true, //tu dong tang 1 khi tao user moi
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true  //check duy nhat
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            group_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 3
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Tim kiem bang email
        await queryInterface.addIndex('users', ['email'], {
            unique: true,
            name: 'users_email_unique'
        });
    },
    // xoa bang
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
