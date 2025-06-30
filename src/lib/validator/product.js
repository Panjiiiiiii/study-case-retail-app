import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, { message: 'Nama produk harus diisi' }),
    price: z.number().min(1, { message: 'Harga produk harus lebih dari 0' }),
    stock: z.number().min(0, { message: 'Stok produk harus lebih dari 0' }),
    imageUrl: z.string().min(1, { message: 'Gambar produk harus diisi' }),
});