import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/response';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return badRequestResponse('Semua field harus diisi');
    }

    if (password.length < 6) {
      return badRequestResponse('Password minimal 6 karakter');
    }

    if (!email.includes('@')) {
      return badRequestResponse('Email tidak valid');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return badRequestResponse('Email sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CASHIER' // Default role for new registrations
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return successResponse({
      message: 'User berhasil didaftarkan',
      data: user
    });

  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse('Terjadi kesalahan saat registrasi', 500);
  }
} 