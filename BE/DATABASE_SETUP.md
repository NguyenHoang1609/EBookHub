# Database Setup Guide

This document provides instructions for setting up the database with the generated Models, Migrations, and Seeders for the E-book platform.

## 📁 Generated Files

### Models (`/src/models/`)
- `User.js` - User management with authentication
- `Ebook.js` - E-book content and metadata
- `SavedPage.js` - User reading progress tracking
- `ReviewRating.js` - Book reviews and ratings
- `Payment.js` - Payment transactions
- `Notification.js` - User notifications system
- `LibraryWishlist.js` - User's library and wishlist
- `Group.js` - User permission groups
- `Role.js` - System roles and permissions
- `GroupRole.js` - Many-to-many relationship between Groups and Roles
- `index.js` - Central model registry with all associations

### Migrations (`/src/migrations/`)
- `20240101000001-create-users.js`
- `20240101000002-create-groups.js`
- `20240101000003-create-roles.js`
- `20240101000004-create-ebooks.js`
- `20240101000005-create-group-roles.js`
- `20240101000006-create-saved-pages.js`
- `20240101000007-create-review-ratings.js`
- `20240101000008-create-payments.js`
- `20240101000009-create-notifications.js`
- `20240101000010-create-library-wishlists.js`

### Seeders (`/src/seeders/`)
- `20240101000001-demo-users.js` - 7 sample users with hashed passwords
- `20240101000002-demo-groups.js` - 6 permission groups
- `20240101000003-demo-roles.js` - 10 system roles/permissions
- `20240101000004-demo-ebooks.js` - 8 sample e-books
- `20240101000005-demo-group-roles.js` - Group-role associations
- `20240101000006-demo-saved-pages.js` - Reading progress data
- `20240101000007-demo-review-ratings.js` - Book reviews and ratings
- `20240101000008-demo-payments.js` - Payment transaction history
- `20240101000009-demo-notifications.js` - User notifications
- `20240101000010-demo-library-wishlists.js` - User libraries and wishlists

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the backend root with your database credentials:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE=ebook_platform
DATABASE_DIALECT=mysql
DATABASE_SSL=false
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Database Setup

#### Create Database
```bash
# Create the database first
mysql -u your_username -p
CREATE DATABASE ebook_platform;
```

#### Run Migrations
```bash
# Run all migrations to create tables
npx sequelize-cli db:migrate
```

#### Run Seeders
```bash
# Populate with sample data
npx sequelize-cli db:seed:all
```

### 4. Usage in Your Application

```javascript
// Import models
const { User, Ebook, ReviewRating, sequelize } = require('./src/models');

// Example: Get user with authored books
const userWithBooks = await User.findByPk(1, {
    include: [{ model: Ebook, as: 'authoredBooks' }]
});

// Example: Get ebook with reviews
const ebookWithReviews = await Ebook.findByPk(1, {
    include: [{ model: ReviewRating, as: 'reviews' }]
});

// Example: Get user's library
const userLibrary = await LibraryWishlist.findAll({
    where: { userId: 1, type: 'library' },
    include: [{ model: Ebook, as: 'ebook' }]
});
```

## 📊 Database Schema Overview

### Key Relationships
- **User** → **Ebook** (1:N) - Authors can have multiple books
- **User** → **ReviewRating** (1:N) - Users can review multiple books
- **User** → **Payment** (1:N) - Users can make multiple purchases
- **User** → **LibraryWishlist** (1:N) - Users have library/wishlist items
- **Ebook** → **SavedPage** (1:N) - Track reading progress per book
- **Group** ↔ **Role** (M:N) - Permission system through GroupRole

### Sample Data Included
- 7 Users (including admin)
- 6 Permission Groups
- 10 System Roles
- 8 E-books (various statuses)
- Complete relational data with realistic examples

## 🚀 Additional Commands

### Reset Database
```bash
# Undo all seeders
npx sequelize-cli db:seed:undo:all

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Re-run everything
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Create New Migration/Seeder
```bash
# Create new migration
npx sequelize-cli migration:generate --name add-new-field

# Create new seeder
npx sequelize-cli seed:generate --name demo-new-data
```

## 🔐 Security Notes

- All sample user passwords are hashed using bcrypt
- Foreign key constraints are properly set up
- Unique constraints prevent duplicate data
- Indexes are added for performance optimization

## 📝 Model Features

### Validation
- Email validation on User model
- Rating range validation (1-5)
- Amount validation for payments
- Required field validation throughout

### Timestamps
- All models include `created_at` and `updated_at`
- Automatic timestamp management

### Soft Deletes
- Consider implementing soft deletes for important data
- Current setup uses CASCADE deletes for referential integrity

---

**Note**: Remember to update your main application entry point to initialize the models:

```javascript
// In your main server file
const { sequelize } = require('./src/models');

// Sync database (development only)
await sequelize.sync();

// Or authenticate connection
await sequelize.authenticate();
```
