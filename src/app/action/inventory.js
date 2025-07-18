'use server';

import { prisma } from '@/lib/prisma';

export async function createInventory(formData) {
    try {
        const productId = formData.get('productId');
        const wholeSalePrice = parseFloat(formData.get('wholeSalePrice'));
        const quantity = parseInt(formData.get('quantity'));

        const result = await prisma.$transaction(async (tx) => {
            const existingProduct = await tx.product.findUnique({
                where: {
                    id: productId
                }
            });

            if (!existingProduct) {
                throw new Error('Produk tidak ditemukan');
            }

            const inventory = await tx.inventory.create({
                data: {
                    productId,
                    wholeSalePrice,
                    quantity
                }
            });

            await tx.product.update({
                where: {
                    id: productId
                },
                data: {
                    stock: existingProduct.stock + quantity
                }
            });

            return inventory;
        });

        return { success: true, message: 'Inventaris berhasil dibuat', data: result };
    } catch (error) {
        console.error('Error creating inventory:', error);
        const message = error.message === 'Produk tidak ditemukan' ? error.message : 'Gagal membuat inventaris';
        return { success: false, message };
    }
}

export async function getInventory () {
    try {
        const inventory = await prisma.inventory.findMany(
            {
                include : {
                    Product : true
                }
            }
        );

        let data = [];

        for (const item of inventory) {
            data.push({
                id: item.id,
                createdAt : item.createdAt,
                product_name : item.Product.name,
                wholeSalePrice: item.wholeSalePrice,
                quantity: item.quantity,
            })
        }
        
        return { success: true, message: 'Inventaris berhasil diambil', data: inventory };
    } catch (error) {
        console.error('Error getting inventory:', error);
        return { success: false, message: 'Gagal mengambil inventaris' };
    }
}

export async function deleteInventory(id) {
    try {
        const inventory = await prisma.inventory.delete({
            where: {
                id: id
            }
        });
        return { success: true, message: 'Inventaris berhasil dihapus', data: inventory };
    } catch (error) {
        console.error('Error deleting inventory:', error);
        return { success: false, message: 'Gagal menghapus inventaris' };
    }
}