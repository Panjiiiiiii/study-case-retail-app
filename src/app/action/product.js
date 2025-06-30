'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createProductSchema } from '@/lib/validator/product';
import { successResponse, errorResponse, notFoundResponse, badRequestResponse } from '@/lib/response';

/**
 * Create a new product
 * @param {Object} formData - Product data
 * @returns {NextResponse} - Response with success status and message
 */
export async function createProduct(formData) {
    try {
        const name = formData.get('name');
        const price = parseFloat(formData.get('price'));
        const stock = parseInt(formData.get('stock'));
        const imageUrl = formData.get('imageUrl') || '';

        // Schema validation
        const validationResult = createProductSchema.safeParse({
            name,
            price,
            stock,
            imageUrl
        });

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err => err.message).join(', ');
            return badRequestResponse(errors);
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                stock,
                imageUrl: imageUrl || null
            }
        });

        revalidatePath('/products');
        revalidatePath('/');

        return successResponse({
            message: 'Produk berhasil ditambahkan',
            data: product
        });

    } catch (error) {
        console.error('Error creating product:', error);
        return errorResponse('Terjadi kesalahan saat menambahkan produk', 500);
    }
}

/**
 * Get all products
 * @returns {NextResponse} - Response with array of products
 */
export async function getAllProducts() {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return successResponse(products);

    } catch (error) {
        console.error('Error fetching products:', error);
        return errorResponse('Terjadi kesalahan saat mengambil data produk', 500);
    }
}

/**
 * Get a single product by ID
 * @param {number} id - Product ID
 * @returns {NextResponse} - Response with product data
 */
export async function getProductById(id) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        });

        if (!product) {
            return notFoundResponse('Produk tidak ditemukan');
        }

        return successResponse(product);

    } catch (error) {
        console.error('Error fetching product:', error);
        return errorResponse('Terjadi kesalahan saat mengambil data produk', 500);
    }
}

/**
 * Update a product
 * @param {number} id - Product ID
 * @param {Object} formData - Updated product data
 * @returns {NextResponse} - Response with success status and message
 */
export async function updateProduct(id, formData) {
    try {
        const name = formData.get('name');
        const price = parseFloat(formData.get('price'));
        const stock = parseInt(formData.get('stock'));
        const imageUrl = formData.get('imageUrl') || '';

        // Schema validation
        const validationResult = createProductSchema.safeParse({
            name,
            price,
            stock,
            imageUrl
        });

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err => err.message).join(', ');
            return badRequestResponse(errors);
        }

        const product = await prisma.product.update({
            where: {
                id: id
            },
            data: {
                name,
                price,
                stock,
                imageUrl: imageUrl || null
            }
        });

        revalidatePath('/products');
        revalidatePath(`/products/${id}`);
        revalidatePath('/');

        return successResponse({
            message: 'Produk berhasil diperbarui',
            data: product
        });

    } catch (error) {
        console.error('Error updating product:', error);

        if (error.code === 'P2025') {
            return notFoundResponse('Produk tidak ditemukan');
        }

        return errorResponse('Terjadi kesalahan saat memperbarui produk', 500);
    }
}

/**
 * Delete a product
 * @returns {NextResponse} - Response with success status and message
 */
export async function deleteProduct(id) {
    try {
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: id
            }
        });

        if (!existingProduct) {
            return notFoundResponse('Produk tidak ditemukan');
        }

        // Check if product is used in transactions
        const transactionItems = await prisma.transactionItem.findMany({
            where: {
                productId: id
            }
        });

        if (transactionItems.length > 0) {
            return badRequestResponse('Produk tidak dapat dihapus karena sudah digunakan dalam transaksi');
        }

        await prisma.product.delete({
            where: {
                id: id
            }
        });

        revalidatePath('/products');
        revalidatePath('/');

        return successResponse({
            message: 'Produk berhasil dihapus'
        });

    } catch (error) {
        console.error('Error deleting product:', error);

        if (error.code === 'P2025') {
            return notFoundResponse('Produk tidak ditemukan');
        }

        return errorResponse('Terjadi kesalahan saat menghapus produk', 500);
    }
}

/**
 * Search products by name
 * @param {string} query - Search query
 * @returns {NextResponse} - Response with array of matching products
 */
export async function searchProducts(query) {
    try {
        if (!query || query.trim() === '') {
            return getAllProducts();
        }

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query.trim(),
                    mode: 'insensitive' // Case insensitive search
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return successResponse(products);

    } catch (error) {
        console.error('Error searching products:', error);
        return errorResponse('Terjadi kesalahan saat mencari produk', 500);
    }
}

/**
 * Update product stock
 * @param {number} id - Product ID
 * @param {number} quantity - Quantity to add/subtract (positive for add, negative for subtract)
 * @returns {NextResponse} - Response with success status and message
 */
export async function updateProductStock(id, quantity) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        });

        if (!product) {
            return notFoundResponse('Produk tidak ditemukan');
        }

        const newStock = product.stock + quantity;

        if (newStock < 0) {
            return badRequestResponse('Stok tidak mencukupi');
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: id
            },
            data: {
                stock: newStock
            }
        });

        revalidatePath('/products');
        revalidatePath(`/products/${id}`);

        return successResponse({
            message: 'Stok produk berhasil diperbarui',
            data: updatedProduct
        });

    } catch (error) {
        console.error('Error updating product stock:', error);
        return errorResponse('Terjadi kesalahan saat memperbarui stok produk', 500);
    }
}
