'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('review_ratings', {
            id: {
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
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            review_text: {
                type: Sequelize.TEXT,
                allowNull: true
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
        await queryInterface.addIndex('review_ratings', ['ebook_id', 'user_id'], {
            unique: true,
            name: 'review_ratings_ebook_id_user_id_unique'
        });

        await queryInterface.addIndex('review_ratings', ['ebook_id'], {
            name: 'review_ratings_ebook_id_index'
        });

        await queryInterface.addIndex('review_ratings', ['user_id'], {
            name: 'review_ratings_user_id_index'
        });

        await queryInterface.addIndex('review_ratings', ['rating'], {
            name: 'review_ratings_rating_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('review_ratings');
    }
};
