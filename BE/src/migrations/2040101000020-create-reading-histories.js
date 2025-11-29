'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reading_histories', {
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
            last_read_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

        await queryInterface.addIndex('reading_histories', ['user_id'], {
            name: 'reading_histories_user_id_index'
        });
        await queryInterface.addIndex('reading_histories', ['ebook_id'], {
            name: 'reading_histories_ebook_id_index'
        });
        await queryInterface.addIndex('reading_histories', ['user_id', 'ebook_id'], {
            unique: true,
            name: 'reading_histories_user_id_ebook_id_unique'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('reading_histories');
    }
};


