# Admin Panel Setup Guide

## Overview
This admin panel provides a complete authentication system with sidebar navigation, dashboard, and management pages.

## Features
- ✅ Admin login page with authentication
- ✅ Protected admin routes
- ✅ Sidebar navigation with responsive design
- ✅ Dashboard with statistics
- ✅ User, Products, Orders, and Settings pages (placeholders)

## Setup Instructions

### 1. Seed Admin User

Run the seed script to create an admin user in the database:

```bash
npm run seed-admin
```

**Default Credentials:**
- Email: `admin@mdfld.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the password after first login!

### 2. Custom Admin Credentials

To use custom credentials, add these to your `.env.local` file:

```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Name
```

Then run the seed script again.

### 3. Access Admin Panel

1. Navigate to: `http://localhost:3000/Admin/login`
2. Enter your admin credentials
3. You'll be redirected to the dashboard

## File Structure

```
app/
├── Admin/
│   ├── layout.tsx          # Admin layout with sidebar & navbar
│   ├── page.tsx             # Redirects to dashboard
│   ├── login/
│   │   └── page.tsx         # Admin login page
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard with stats
│   ├── users/
│   │   └── page.tsx         # Users management (placeholder)
│   ├── products/
│   │   └── page.tsx         # Products management (placeholder)
│   ├── orders/
│   │   └── page.tsx         # Orders management (placeholder)
│   └── settings/
│       └── page.tsx         # Settings page (placeholder)
└── api/
    └── admin/
        ├── login/
        │   └── route.ts     # Admin login API
        ├── me/
        │   └── route.ts     # Get current admin user
        └── logout/
            └── route.ts     # Admin logout API

scripts/
└── seed-admin.js            # Seed script for admin user

models/
└── User.ts                  # Updated with role field
```

## API Endpoints

### POST `/api/admin/login`
Login as admin
```json
{
  "email": "admin@mdfld.com",
  "password": "admin123"
}
```

### GET `/api/admin/me`
Get current admin user (requires admin_token cookie)

### POST `/api/admin/logout`
Logout admin (clears admin_token cookie)

## User Model Changes

The User model now includes a `role` field:
- `role: 'user' | 'admin'` (default: 'user')

## Security Notes

1. Admin authentication uses a separate cookie (`admin_token`) from regular users
2. All admin routes check for admin role
3. Regular users cannot access admin routes even if they have a token
4. Change default admin password immediately after setup

## Next Steps

1. Implement actual functionality for Users, Products, Orders pages
2. Add role-based permissions if needed
3. Add more dashboard statistics
4. Implement admin activity logging
5. Add admin user management (create/edit/delete admins)
