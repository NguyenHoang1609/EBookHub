module.exports = {
    async up ( queryInterface, Sequelize ) {
        await queryInterface.createTable('favourite_types', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
           
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

             type: {
                type: Sequelize.TEXT,
                length:50,
                allowNull: false
            },
         
            description: {
                type: Sequelize.TEXT,
                allowNull: false
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

    
    
    },

    down: async ({ context: queryInterface, Sequelize }) => {
        await queryInterface.dropTable('favourite_types');
        await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_favourite_types_type\";");
        await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_favourite_types_status\";");
    }
};




