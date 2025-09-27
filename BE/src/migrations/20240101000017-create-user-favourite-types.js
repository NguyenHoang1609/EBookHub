'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_favourite_types', {
            user_favourite_type_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            type_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'types',
                    key: 'type_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
        await queryInterface.addIndex('user_favourite_types', ['user_id'], {
            name: 'user_favourite_types_user_id_index'
        });

        await queryInterface.addIndex('user_favourite_types', ['type_id'], {
            name: 'user_favourite_types_type_id_index'
        });

        // Add unique constraint to prevent duplicate user-type combinations
        await queryInterface.addIndex('user_favourite_types', ['user_id', 'type_id'], {
            unique: true,
            name: 'user_favourite_types_unique_combination'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_favourite_types');
    }
};
