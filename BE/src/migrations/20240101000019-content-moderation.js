'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('content_moderation', {
            moderation_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            word: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            severity: {
                type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
                allowNull: false,
                defaultValue: 'medium'
            },
            category: {
                type: Sequelize.ENUM('profanity', 'violence', 'hate_speech', 'sexual', 'spam', 'political', 'religious', 'other'),
                allowNull: false,
                defaultValue: 'other'
            },
            language: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'vi'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            updated_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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
        await queryInterface.addIndex('content_moderation', ['word'], {
            name: 'content_moderation_word_index',
            unique: true
        });

        await queryInterface.addIndex('content_moderation', ['severity'], {
            name: 'content_moderation_severity_index'
        });

        await queryInterface.addIndex('content_moderation', ['category'], {
            name: 'content_moderation_category_index'
        });

        await queryInterface.addIndex('content_moderation', ['language'], {
            name: 'content_moderation_language_index'
        });

        await queryInterface.addIndex('content_moderation', ['is_active'], {
            name: 'content_moderation_is_active_index'
        });

        await queryInterface.addIndex('content_moderation', ['created_by'], {
            name: 'content_moderation_created_by_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('content_moderation');
    }
};
