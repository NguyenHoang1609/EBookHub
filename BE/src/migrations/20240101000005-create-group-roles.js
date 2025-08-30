'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('group_roles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            group_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'groups',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id'
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
        await queryInterface.addIndex('group_roles', ['group_id', 'role_id'], {
            unique: true,
            name: 'group_roles_group_id_role_id_unique'
        });

        await queryInterface.addIndex('group_roles', ['group_id'], {
            name: 'group_roles_group_id_index'
        });

        await queryInterface.addIndex('group_roles', ['role_id'], {
            name: 'group_roles_role_id_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('group_roles');
    }
};
