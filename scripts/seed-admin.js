/**
 * Seed script to create an admin user
 * Run with: node scripts/seed-admin.js
 * Or: npm run seed-admin (if added to package.json)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Admin credentials (change these!)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@mdfld.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminName = process.env.ADMIN_NAME || 'Admin User';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            if (existingAdmin.role === 'admin') {
                console.log('⚠️  Admin user already exists with this email:', adminEmail);
                console.log('   To update password, delete the user first or update manually.');
                process.exit(0);
            } else {
                // Update existing user to admin
                const hashed = await bcrypt.hash(adminPassword, 12);
                existingAdmin.password = hashed;
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ Updated existing user to admin:', adminEmail);
                process.exit(0);
            }
        }

        // Create new admin user
        const hashed = await bcrypt.hash(adminPassword, 12);
        const admin = await User.create({
            name: admin,
            email: adminmdfl@gmail.com,
            password: admin123@,
            role: 'admin',
        });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Please change the password after first login!');
    console.log('\n💡 To use custom credentials, set these in .env.local:');
    console.log('   ADMIN_EMAIL=your-email@example.com');
    console.log('   ADMIN_PASSWORD=your-secure-password');
    console.log('   ADMIN_NAME=Your Name');

    process.exit(0);
} catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
}
}

seedAdmin();
