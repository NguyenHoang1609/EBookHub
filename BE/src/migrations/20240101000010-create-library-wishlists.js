'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('library_wishlists', {
            id: {
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
        await queryInterface.addIndex('library_wishlists', ['user_id', 'ebook_id', 'type'], {
            unique: true,
            name: 'library_wishlists_user_id_ebook_id_type_unique'
        });

        await queryInterface.addIndex('library_wishlists', ['user_id'], {
            name: 'library_wishlists_user_id_index'
        });

        await queryInterface.addIndex('library_wishlists', ['ebook_id'], {
            name: 'library_wishlists_ebook_id_index'
        });

        await queryInterface.addIndex('library_wishlists', ['type'], {
            name: 'library_wishlists_type_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('library_wishlists');
    }
};
