'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('comments', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
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
            parent_comment_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'comments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [1, 2000]
                }
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Add indexes for better performance
        await queryInterface.addIndex('comments', ['ebook_id']);
        await queryInterface.addIndex('comments', ['user_id']);
        await queryInterface.addIndex('comments', ['parent_comment_id']);
        await queryInterface.addIndex('comments', ['created_at']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('comments');
    }
};
