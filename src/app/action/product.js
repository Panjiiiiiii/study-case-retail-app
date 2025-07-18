'use server';

import { prisma } from '@/lib/prisma';
import { createProductSchema } from '@/lib/validator/product';

export async function createProduct(formData) {
    try {
        const name = formData.get('name');
        const price = parseFloat(formData.get('price'));
        const stock = parseInt(formData.get('stock'));
        const unitId = formData.get('unitId');
        const categoryId = formData.get('categoryId');
        const imageUrl = formData.get('imageUrl') || '';

        // Schema validation
        const validationResult = createProductSchema.safeParse({
            name,
            price,
            stock,
            imageUrl,
            unitId,
            categoryId
        });

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err => err.message).join(', ');
            return badRequestResponse(errors);
        }

        const existingUnit = await prisma.unit.findUnique({
            where: {
                id: unitId
            }
        });

        const existingCategory = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        });

        if (!existingCategory || !existingUnit) {
            return { success: false, message: 'Kategori atau satuan produk tidak ditemukan' };
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                stock,
                unitId,
                categoryId,
                imageUrl: imageUrl || null
            }
        });

        return { success: true, message: 'Produk berhasil ditambahkan', data: product };

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

        return { success: true, data: products, message: 'Data produk berhasil diambil' };

    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, message: 'Terjadi kesalahan saat mengambil data produk', error: error.message };
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
            return { success: false, message: 'Produk tidak ditemukan' };
        }

        return { success: true, data: product, message: 'Data produk berhasil diambil' };

    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, message: 'Terjadi kesalahan saat mengambil data produk', error: error.message };
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
        const unitId = formData.get('unitId');
        const categoryId = formData.get('categoryId');

        // Schema validation
        const validationResult = createProductSchema.safeParse({
            name,
            price,
            unitId,
            categoryId,
            stock,
            imageUrl
        });

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(err => err.message).join(', ');
            return { success: false, message: errors };
        }

        const product = await prisma.product.update({
            where: {
                id: id
            },
            data: {
                name,
                price,
                stock,
                imageUrl: imageUrl || null,
                unitId,
                categoryId
            }
        });
        return { success: true, data: product, message: 'Produk berhasil diperbarui' };

    } catch (error) {
        console.error('Error updating product:', error);

        if (error.code === 'P2025') {
            return { success: false, message: 'Produk tidak ditemukan' };
        }

        return { success: false, message: 'Terjadi kesalahan saat memperbarui produk', error: error.message };
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
            return { success: false, message: 'Produk tidak ditemukan' };
        }

        // Check if product is used in transactions
        const transactionItems = await prisma.transactionItem.findMany({
            where: {
                productId: id
            }
        });

        if (transactionItems.length > 0) {
            return { success: false, message: 'Produk tidak dapat dihapus karena sudah digunakan dalam transaksi' };
        }

        await prisma.product.delete({
            where: {
                id: id
            }
        });

        return { success: true, message: 'Produk berhasil dihapus' };

    } catch (error) {
        console.error('Error deleting product:', error);

        if (error.code === 'P2025') {
            return { success: false, message: 'Produk tidak ditemukan' };
        }

        return { success: false, message: 'Terjadi kesalahan saat menghapus produk', error: error.message };
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

        return { success: true, data: products, message: 'Data produk berhasil diambil' };

    } catch (error) {
        console.error('Error searching products:', error);
        return { success: false, message: 'Terjadi kesalahan saat mencari produk', error: error.message };
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
            return { success: false, message: 'Produk tidak ditemukan' };
        }

        const newStock = product.stock + quantity;

        if (newStock < 0) {
            return { success: false, message: 'Stok tidak mencukupi' };
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: id
            },
            data: {
                stock: newStock
            }
        });

        return { success: true, data: updatedProduct, message: 'Stok produk berhasil diperbarui' };

    } catch (error) {
        console.error('Error updating product stock:', error);
        return { success: false, message: 'Terjadi kesalahan saat memperbarui stok produk', error: error.message };
    }
}
