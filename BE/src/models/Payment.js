const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDb');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    webhookId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'webhook_id',
        comment: 'Transaction ID from SePay webhook'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    accountNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'account_number'
    },
    gateway: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'transaction_date'
    },
    code: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    transferType: {
        type: DataTypes.ENUM('in', 'out'),
        allowNull: true,
        field: 'transfer_type'
    },
    transferAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'transfer_amount'
    },
    accumulated: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    subAccount: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'sub_account'
    },
    referenceCode: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: false,
        field: 'reference_code'
    },
    rawDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'raw_description'
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['user_id']
        },

        {
            fields: ['status']
        },
        {
            fields: ['created_at']
        }
    ]
});
// Payment.sync({ alter: true });
module.exports = Payment;
