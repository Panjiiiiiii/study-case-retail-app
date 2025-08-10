'use server';

import { prisma } from '@/lib/prisma';


export async function createInventoryMany(list) {
  try {
    if (!Array.isArray(list) || list.length === 0) {
      return { success: false, message: "Tidak ada data yang dikirim" };
    }

    await prisma.$transaction(async (tx) => {
      // Insert ke inventory
      await tx.inventory.createMany({
        data: list.map(item => ({
          productId: item.id,
          wholeSalePrice: item.wholesalePrice,
          quantity: item.stock
        }))
      });

      // Update stok produk satu-satu
      for (const item of list) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: { increment: item.stock }
          }
        });
      }
    });

    return { success: true, message: "Inventaris berhasil ditambahkan" };
  } catch (error) {
    console.error("Error createInventoryMany:", error);
    return { success: false, message: "Gagal menambahkan inventaris" };
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
                date : item.createdAt,
                product : item.Product.name,
                price : item.wholeSalePrice,
                quantity: item.quantity,
            })
        }
        
        return { success: true, message: 'Inventaris berhasil diambil', data };
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