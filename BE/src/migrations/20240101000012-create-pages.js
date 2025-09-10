'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('pages', {
            page_id: {
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
            page_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
                field: 'content'
            },
            status: {
                type: Sequelize.ENUM('draft', 'published', 'archived'),
                allowNull: false,
                defaultValue: 'draft'
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
        await queryInterface.addIndex('pages', ['ebook_id'], {
            name: 'pages_ebook_id_index'
        });

        await queryInterface.addIndex('pages', ['page_number'], {
            name: 'pages_page_number_index'
        });

        await queryInterface.addIndex('pages', ['status'], {
            name: 'pages_status_index'
        });

        // Add unique constraint for ebook_id and page_number combination
        await queryInterface.addIndex('pages', ['ebook_id', 'page_number'], {
            unique: true,
            name: 'pages_ebook_page_unique'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('pages');
    }
};
