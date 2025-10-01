'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ebooks', {
            ebook_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            author_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            title: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            cover_image: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            view_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            status: {
                type: Sequelize.ENUM('draft', 'published', 'archived', 'pending_review', 'blocked'),
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
        await queryInterface.addIndex('ebooks', ['author_id'], {
            name: 'ebooks_author_id_index'
        });

        await queryInterface.addIndex('ebooks', ['status'], {
            name: 'ebooks_status_index'
        });

        await queryInterface.addIndex('ebooks', ['title'], {
            name: 'ebooks_title_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ebooks');
    }
};
