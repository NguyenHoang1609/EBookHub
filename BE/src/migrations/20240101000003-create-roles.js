'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('roles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            url: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            method: {
                type: Sequelize.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH'),
                allowNull: false,
                defaultValue: 'GET'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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

        // Add indexes
        await queryInterface.addIndex('roles', ['url', 'method'], {
            unique: true,
            name: 'roles_url_method_unique'
        });

        await queryInterface.addIndex('roles', ['method'], {
            name: 'roles_method_index'
        });

        await queryInterface.addIndex('roles', ['is_active'], {
            name: 'roles_is_active_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('roles');
    }
};
