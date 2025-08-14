"use server";

import { prisma } from "@/lib/prisma";

export async function getSumTransaction() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // jam 00:00 hari ini

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // jam 23:59:59 hari ini

  const transactions = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      items: {
        select: {
          quantity: true,
          product: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

  const soldItems = transactions.reduce((sum, transaction) => {
    const transactionTotal = transaction.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    return sum + transactionTotal;
  }, 0);

  const totalRevenue = transactions.reduce((sum, transaction) => {
    const transactionTotal = transaction.items.reduce((itemSum, item) => itemSum + (item.quantity * item.product.price), 0);
    return sum + transactionTotal;
  }, 0);

  return { soldItems, totalRevenue };
}

export async function topSaleProducts() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // jam 00:00 hari ini

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // jam 23:59:59 hari ini

    // Ambil semua transaksi hari ini beserta item dan produk
    const transactions = await prisma.transaction.findMany({
        where: {
            createdAt: {
                gte: startOfDay,
                lt: endOfDay,
            },
        },
        include: {
            items: {
                select: {
                    product: true,
                    quantity: true,
                },
            },
        },
    });

    // Hitung total qty per produk
    const productMap = new Map();

    transactions.forEach(transaction => {
        transaction.items.forEach(item => {
            const key = item.product.id;
            if (!productMap.has(key)) {
                productMap.set(key, { product: item.product, qty: 0 });
            }
            productMap.get(key).qty += item.quantity;
        });
    });

    // Ambil top 3 produk berdasarkan qty
    const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 3);

    return topProducts;
}