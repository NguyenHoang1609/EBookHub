'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ebook_types', {
            ebook_type_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ebook_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ebooks',
                    key: 'ebook_id'
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
        await queryInterface.addIndex('ebook_types', ['ebook_id'], {
            name: 'ebook_types_ebook_id_index'
        });

        await queryInterface.addIndex('ebook_types', ['type_id'], {
            name: 'ebook_types_type_id_index'
        });

        // Add unique constraint to prevent duplicate ebook-type combinations
        await queryInterface.addIndex('ebook_types', ['ebook_id', 'type_id'], {
            unique: true,
            name: 'ebook_types_unique_combination'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ebook_types');
    }
};
