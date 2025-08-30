const { sequelize } = require('../config/connectDb');

// Import all models
const User = require('./User');
const Ebook = require('./Ebook');
const SavedPage = require('./SavedPage');
const ReviewRating = require('./ReviewRating');
const Payment = require('./Payment');
const Notification = require('./Notification');
const LibraryWishlist = require('./LibraryWishlist');
const Group = require('./Group');
const Role = require('./Role');
const GroupRole = require('./GroupRole');

// Define associations
// User associations
User.hasMany(Ebook, { foreignKey: 'authorId', as: 'authoredBooks' });
User.hasMany(ReviewRating, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
User.hasMany(LibraryWishlist, { foreignKey: 'userId', as: 'libraryItems' });
User.hasMany(SavedPage, { foreignKey: 'userId', as: 'savedPages' });
User.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// User notification associations (sender/receiver)
User.hasMany(Notification, { foreignKey: 'senderId', as: 'sentNotifications' });
User.hasMany(Notification, { foreignKey: 'receiverId', as: 'receivedNotifications' });

// Ebook associations
Ebook.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Ebook.hasMany(SavedPage, { foreignKey: 'bookId', as: 'savedPages' });
Ebook.hasMany(ReviewRating, { foreignKey: 'ebookId', as: 'reviews' });
Ebook.hasMany(Payment, { foreignKey: 'ebookId', as: 'payments' });
Ebook.hasMany(Notification, { foreignKey: 'bookId', as: 'notifications' });
Ebook.hasMany(LibraryWishlist, { foreignKey: 'ebookId', as: 'libraryItems' });

// SavedPage associations
SavedPage.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SavedPage.belongsTo(Ebook, { foreignKey: 'bookId', as: 'ebook' });

// ReviewRating associations
ReviewRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ReviewRating.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });

// Payment associations
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Payment.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Notification.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Notification.belongsTo(Ebook, { foreignKey: 'bookId', as: 'ebook' });

// LibraryWishlist associations
LibraryWishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
LibraryWishlist.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });

// Group associations
Group.hasMany(User, { foreignKey: 'groupId', as: 'users' });

// Group-Role many-to-many associations
Group.belongsToMany(Role, {
    through: GroupRole,
    foreignKey: 'groupId',
    otherKey: 'roleId',
    as: 'roles'
});

Role.belongsToMany(Group, {
    through: GroupRole,
    foreignKey: 'roleId',
    otherKey: 'groupId',
    as: 'groups'
});

// GroupRole associations
GroupRole.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
GroupRole.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// Export all models and sequelize instance
module.exports = {
    sequelize,
    User,
    Ebook,
    SavedPage,
    ReviewRating,
    Payment,
    Notification,
    LibraryWishlist,
    Group,
    Role,
    GroupRole
};
