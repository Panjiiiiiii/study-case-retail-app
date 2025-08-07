"use server";

import { prisma } from "@/lib/prisma"; // pastikan prisma tersedia
import cloudinary from "@/lib/cloudinary"; // konfigurasi cloudinary
import { createProductSchema } from "@/lib/validator/product";// Zod schema

export async function createProduct(prevState, formData) {
    try {
        const name = formData.get("name");
        const price = parseFloat(formData.get("price"));
        const stock = parseInt(formData.get("stock"));
        const categoryId = formData.get("categoryId");


        let imageUrl;
        const imageFile = formData.get("image");

        if (imageFile && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "erp-products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            if (uploadResult && uploadResult.secure_url) {
                imageUrl = uploadResult.secure_url;
            } else {
                return { success: false, message: "Gagal mengunggah gambar produk" };
            }
        }

        console.log({ name, price, stock, imageUrl, categoryId });


        const validationResult = createProductSchema.safeParse({
            name,
            price,
            stock,
            imageUrl,
            categoryId,
        });

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map((err) => err.message).join(", ");
            return { success: false, message: errors };
        }

        const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });

        if (!existingCategory) {
            return { success: false, message: "Kategori atau satuan tidak ditemukan" };
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                stock,
                categoryId,

                imageUrl: imageUrl || null,
            },
        });

        return {
            success: true,
            message: "Produk berhasil ditambahkan",
            data: product,
        };
    } catch (error) {
        console.error("Error creating product:", error);
        return { success: false, message: "Terjadi kesalahan saat menambahkan produk" };
    }
}

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

export async function updateProduct(id, formData) {
    try {
        const name = formData.get('name');
        const price = parseFloat(formData.get('price'));
        const stock = parseInt(formData.get('stock'));
        const imageFile = formData.get("image");
        const categoryId = formData.get('categoryId');

        let imageUrl;

        const existingProduct = await prisma.product.findUnique({
            where: {
                id: id
            }
        });
        
        if (!existingProduct) {
            return { success: false, message: 'Produk tidak ditemukan' };
        }

        if (imageFile && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "erp-products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            if (uploadResult && uploadResult.secure_url) {
                imageUrl = uploadResult.secure_url;
            } else {
                return { success: false, message: "Gagal mengunggah gambar produk" };
            }
        }

        // Schema validation
        const validationResult = createProductSchema.safeParse({
            name,
            price,
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
                name: name || existingProduct.name,
                price : price || existingProduct.price,
                stock: stock || existingProduct.stock,
                imageUrl: imageUrl || existingProduct.imageUrl,
                categoryId: categoryId || existingProduct.categoryId
            }
        });
        return { success: true, data: product, message: 'Produk berhasil diperbarui' };

    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, message: 'Terjadi kesalahan saat memperbarui produk', error: error.message };
    }
}

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
