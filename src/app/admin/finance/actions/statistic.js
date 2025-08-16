"use server";

import { prisma } from "@/lib/prisma";

export default async function monthlyProfit() {
    // Get current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Calculate Monthly Expense from Inventory (logistic)
    // wholeSalePrice * quantity for items added this month
    const inventoryData = await prisma.inventory.findMany({
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
        select: {
            wholeSalePrice: true,
            quantity: true,
        },
    });

    const monthlyExpense = inventoryData.reduce((total, item) => {
        return total + (item.wholeSalePrice * item.quantity);
    }, 0);

    // Calculate Monthly Revenue from Transactions
    const transactions = await prisma.transaction.findMany({
        where: {
            createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
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

    const monthlyRevenue = transactions.reduce((sum, transaction) => {
        const transactionTotal = transaction.items.reduce((itemSum, item) => {
            return itemSum + (item.quantity * item.product.price);
        }, 0);
        return sum + transactionTotal;
    }, 0);

    // Calculate Monthly Profit
    const monthlyProfit = monthlyRevenue - monthlyExpense;

    return {
        monthlyExpense,
        monthlyRevenue,
        monthlyProfit,
        month: now.toLocaleString('id-ID', { month: 'long', year: 'numeric' })
    };
};
