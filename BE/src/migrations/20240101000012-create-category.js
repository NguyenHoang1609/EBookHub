'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Categorys', {
            Category_id: {
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


            category: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            description: {
                type: Sequelize.STRING(255),
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


    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Categorys');
    }
};
