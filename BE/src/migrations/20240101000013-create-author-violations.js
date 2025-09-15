module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('author_violations', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
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
            ebook_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'ebooks',
                    key: 'ebook_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            reported_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            type: {
                type: Sequelize.ENUM('copyright', 'plagiarism', 'abuse', 'spam', 'other'),
                allowNull: false,
                defaultValue: 'other'
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('open', 'under_review', 'resolved', 'dismissed'),
                allowNull: false,
                defaultValue: 'open'
            },
            action_taken: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.addIndex('author_violations', ['author_id']);
        await queryInterface.addIndex('author_violations', ['ebook_id']);
        await queryInterface.addIndex('author_violations', ['reported_by']);
        await queryInterface.addIndex('author_violations', ['status']);
        await queryInterface.addIndex('author_violations', ['type']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('author_violations');
        await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_author_violations_type\";");
        await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_author_violations_status\";");
    }
};





