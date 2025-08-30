'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('saved_pages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ebooks',
                    key: 'ebook_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
            number_page: {
                type: Sequelize.INTEGER,
                allowNull: false
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
        await queryInterface.addIndex('saved_pages', ['book_id', 'user_id'], {
            unique: true,
            name: 'saved_pages_book_id_user_id_unique'
        });

        await queryInterface.addIndex('saved_pages', ['user_id'], {
            name: 'saved_pages_user_id_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('saved_pages');
    }
};
