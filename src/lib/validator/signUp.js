import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(1, { message: 'Nama harus diisi' }),
    email: z.string().email({ message: 'Email tidak valid' }),
    password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});