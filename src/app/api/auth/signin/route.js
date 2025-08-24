import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/response';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return badRequestResponse('Email dan password harus diisi');
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return badRequestResponse('Email atau password salah');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return badRequestResponse('Email atau password salah');
    }

    // Return user data without password
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return successResponse({
      message: 'Login berhasil',
      data: userData
    });

  } catch (error) {
    console.error('Signin error:', error);
    return errorResponse('Terjadi kesalahan saat login');
  }
}
