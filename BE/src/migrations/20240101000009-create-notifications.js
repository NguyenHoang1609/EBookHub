'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notifications', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            sender_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            receiver_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            book_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'ebooks',
                    key: 'ebook_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            is_read: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            type: {
                type: Sequelize.ENUM('system', 'user', 'admin', 'payment', 'review'),
                allowNull: false,
                defaultValue: 'user'
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
        await queryInterface.addIndex('notifications', ['sender_id'], {
            name: 'notifications_sender_id_index'
        });

        await queryInterface.addIndex('notifications', ['receiver_id'], {
            name: 'notifications_receiver_id_index'
        });

        await queryInterface.addIndex('notifications', ['book_id'], {
            name: 'notifications_book_id_index'
        });

        await queryInterface.addIndex('notifications', ['is_read'], {
            name: 'notifications_is_read_index'
        });

        await queryInterface.addIndex('notifications', ['type'], {
            name: 'notifications_type_index'
        });

        await queryInterface.addIndex('notifications', ['created_at'], {
            name: 'notifications_created_at_index'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('notifications');
    }
};
