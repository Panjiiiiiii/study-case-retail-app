import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signUpSchema } from '@/lib/validator/signUp';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/response';

export async function POST(request) {
  try {
    const { name, email, password } = signUpSchema.parse(await request.json());

    const { error } = signUpSchema.safeParse({ name, email, password });

    if (error) {
      return badRequestResponse(error.message);
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