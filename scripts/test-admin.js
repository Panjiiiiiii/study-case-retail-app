const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log('Testing admin login...');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);

    // Find admin user
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found!');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password hash preview:', admin.password.substring(0, 20) + '...');

    // Test password
    const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
    console.log('Password validation:', isPasswordValid ? '✅ VALID' : '❌ INVALID');

    if (!isPasswordValid) {
      console.log('\n🔧 Recreating admin with fresh password...');
      
      // Delete existing admin
      await prisma.user.delete({
        where: { email: adminEmail }
      });

      // Create new admin with fresh hash
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const newAdmin = await prisma.user.create({
        data: {
          name: process.env.ADMIN_NAME,
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });

      console.log('✅ Admin recreated successfully!');
      
      // Test again
      const isNewPasswordValid = await bcrypt.compare(adminPassword, newAdmin.password);
      console.log('New password validation:', isNewPasswordValid ? '✅ VALID' : '❌ INVALID');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();
