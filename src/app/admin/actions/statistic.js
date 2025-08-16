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

export async function weeklyReport() {
  // Get date range for this week (Monday to Sunday)
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const soldItems = [];
  const weekRevenue = [];
  const weekTransaction = [];

  // Generate data for each day of the week
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get transactions for this day
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

    // Calculate daily statistics
    const dailySoldItems = transactions.reduce((sum, transaction) => {
      const transactionTotal = transaction.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      return sum + transactionTotal;
    }, 0);

    const dailyRevenue = transactions.reduce((sum, transaction) => {
      const transactionTotal = transaction.items.reduce((itemSum, item) => itemSum + (item.quantity * item.product.price), 0);
      return sum + transactionTotal;
    }, 0);

    const dailyTransactionCount = transactions.length;

    // Day labels
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    soldItems.push({
      label: dayLabels[i],
      value: dailySoldItems
    });

    weekRevenue.push({
      label: dayLabels[i],
      value: dailyRevenue
    });

    weekTransaction.push({
      label: dayLabels[i],
      value: dailyTransactionCount
    });
  }

  return {
    soldItems,
    weekRevenue,
    weekTransaction
  };
}