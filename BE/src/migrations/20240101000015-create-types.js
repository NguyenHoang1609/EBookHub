'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('types', {
            type_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
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
        await queryInterface.addIndex('types', ['name'], {
            unique: true,
            name: 'types_name_unique'
        });

        await queryInterface.addIndex('types', ['is_active'], {
            name: 'types_is_active_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('types');
    }
};
