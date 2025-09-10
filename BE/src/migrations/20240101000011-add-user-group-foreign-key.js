'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add foreign key constraint for group_id in users table
        await queryInterface.addConstraint('users', {
            fields: ['group_id'],
            type: 'foreign key',
            name: 'users_group_id_fkey',
            references: {
                table: 'groups',
                field: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add index for performance
        await queryInterface.addIndex('users', ['group_id'], {
            name: 'users_group_id_index'
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove the foreign key constraint
        await queryInterface.removeConstraint('users', 'users_group_id_fkey');

        // Remove the index
        await queryInterface.removeIndex('users', 'users_group_id_index');
    }
};
