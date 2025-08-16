"use server";

import { prisma } from "@/lib/prisma";

export async function monthlyProfit() {
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

export async function salesDistribution() {
    // Get date range for this week (Monday to Sunday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // Get all transactions for this week
    const transactions = await prisma.transaction.findMany({
        where: {
            createdAt: {
                gte: monday,
                lte: sunday,
            },
        },
        include: {
            items: {
                select: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    quantity: true,
                },
            },
        },
    });

    // Calculate product distribution
    const productMap = new Map();

    transactions.forEach(transaction => {
        transaction.items.forEach(item => {
            const key = item.product.id;
            if (!productMap.has(key)) {
                productMap.set(key, { 
                    name: item.product.name, 
                    value: 0 
                });
            }
            productMap.get(key).value += item.quantity;
        });
    });

    // Get top 5 products by quantity sold
    const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return topProducts;
};

export async function weeklyTransactionDistribution() {
    // Get date range for this week (Monday to Sunday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const weeklyData = [];

    // Generate data for each day of the week
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Get total transaction value for this day
        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
            select: {
                total: true,
            },
        });

        const dailyTotal = transactions.reduce((sum, transaction) => sum + transaction.total, 0);

        // Day labels
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayIndex = i === 6 ? 0 : i + 1; // Adjust for Sunday being first in array
        
        weeklyData.push({
            name: dayLabels[dayIndex],
            value: dailyTotal
        });
    }

    return weeklyData;
};