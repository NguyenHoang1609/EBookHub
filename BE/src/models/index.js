const { sequelize } = require('../config/connectDb');

// Import all models
const User = require('./User');
const Ebook = require('./Ebook');
const Page = require('./Page');
const SavedPage = require('./SavedPage');
const ReviewRating = require('./ReviewRating');
const Payment = require('./Payment');
const Notification = require('./Notification');
const LibraryWishlist = require('./LibraryWishlist');
const Group = require('./Group');
const Role = require('./Role');
const GroupRole = require('./GroupRole');
const AuthorViolation = require('./AuthorViolation');
const ContentModeration = require('./ContentModeration');
const Category = require('./Category');
const Comment = require('./Comment');
const Type = require('./Type');
const EbookType = require('./EbookType');
const UserFavouriteType = require('./UserFavouriteType');
const ReadingHistory = require('./ReadingHistory');

// Define associations
// User associations
User.hasMany(Ebook, { foreignKey: 'authorId', as: 'authoredBooks' });
User.hasMany(AuthorViolation, { foreignKey: 'authorId', as: 'authorViolations' });
User.hasMany(AuthorViolation, { foreignKey: 'reportedBy', as: 'reportedViolations' });
User.hasMany(ReviewRating, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
User.hasMany(LibraryWishlist, { foreignKey: 'userId', as: 'libraryItems' });
User.hasMany(SavedPage, { foreignKey: 'userId', as: 'savedPages' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
User.hasMany(ReadingHistory, { foreignKey: 'userId', as: 'readingHistories' });
User.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// User-Type many-to-many associations (favourite types)
User.belongsToMany(Type, {
    through: UserFavouriteType,
    foreignKey: 'userId',
    otherKey: 'typeId',
    as: 'favouriteTypes'
});

// User notification associations (sender/receiver)
User.hasMany(Notification, { foreignKey: 'senderId', as: 'sentNotifications' });
User.hasMany(Notification, { foreignKey: 'receiverId', as: 'receivedNotifications' });

// Ebook associations
Ebook.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Ebook.hasMany(Page, { foreignKey: 'ebookId', as: 'pages' });
Ebook.hasMany(SavedPage, { foreignKey: 'bookId', as: 'savedPages' });
Ebook.hasMany(ReviewRating, { foreignKey: 'ebookId', as: 'reviews' });
Ebook.hasMany(Notification, { foreignKey: 'bookId', as: 'notifications' });
Ebook.hasMany(LibraryWishlist, { foreignKey: 'ebookId', as: 'libraryItems' });
Ebook.hasMany(AuthorViolation, { foreignKey: 'ebookId', as: 'violations' });
Ebook.hasMany(Category, { foreignKey: 'ebookId', as: 'categories' });
Ebook.hasMany(Comment, { foreignKey: 'ebookId', as: 'comments' });
Ebook.hasMany(ReadingHistory, { foreignKey: 'ebookId', as: 'readingHistories' });

// Ebook-Type many-to-many associations
Ebook.belongsToMany(Type, {
    through: EbookType,
    foreignKey: 'ebookId',
    otherKey: 'typeId',
    as: 'types'
});

// Page associations
Page.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });

// SavedPage associations
SavedPage.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SavedPage.belongsTo(Ebook, { foreignKey: 'bookId', as: 'ebook' });

// ReadingHistory associations
ReadingHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ReadingHistory.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });

// ReviewRating associations
ReviewRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ReviewRating.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });

// Payment associations
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });


// Notification associations
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Notification.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Notification.belongsTo(Ebook, { foreignKey: 'bookId', as: 'ebook' });

// AuthorViolation associations
AuthorViolation.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
AuthorViolation.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });
AuthorViolation.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });

// ContentModeration associations
ContentModeration.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
ContentModeration.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

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

// Comment associations
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });
Comment.belongsTo(Comment, { foreignKey: 'parentCommentId', as: 'parentComment' });
Comment.hasMany(Comment, { foreignKey: 'parentCommentId', as: 'replies' });

// Type associations
Type.belongsToMany(Ebook, {
    through: EbookType,
    foreignKey: 'typeId',
    otherKey: 'ebookId',
    as: 'ebooks'
});

Type.belongsToMany(User, {
    through: UserFavouriteType,
    foreignKey: 'typeId',
    otherKey: 'userId',
    as: 'favouriteUsers'
});

// Junction table associations
EbookType.belongsTo(Ebook, { foreignKey: 'ebookId', as: 'ebook' });
EbookType.belongsTo(Type, { foreignKey: 'typeId', as: 'type' });

UserFavouriteType.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserFavouriteType.belongsTo(Type, { foreignKey: 'typeId', as: 'type' });

// Export all models and sequelize instance
module.exports = {
    sequelize,
    User,
    Ebook,
    Page,
    SavedPage,
    ReviewRating,
    Payment,
    Notification,
    LibraryWishlist,
    Group,
    Role,
    GroupRole,
    AuthorViolation,
    ContentModeration,
    Comment,
    Type,
    EbookType,
    UserFavouriteType,
    ReadingHistory
};
