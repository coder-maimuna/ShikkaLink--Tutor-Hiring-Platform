const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    const adminEmail = 'admin@shikkalink.com';
    const adminPassword = 'admin123'; // Change this in production!

    console.log('Seeding admin account...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin account already exists. Skipping.');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        full_name: 'Administrator',
        email: adminEmail,
        phone: null,
        address: null,
        password_hash: passwordHash,
        role: 'admin',
        is_verified: true,
        is_active: true,
        university: null
      }
    });

    console.log('✓ Admin account created successfully!');
    console.log(`Admin ID: ${admin.user_id}`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\n⚠️  IMPORTANT: Change the admin password in production!');
  } catch (error) {
    console.error('Error seeding admin account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
