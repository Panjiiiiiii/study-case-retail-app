'use server';

import { prisma } from '@/lib/prisma';

export async function createTransaction(formData) {
    try {
        // Comment session check for now since middleware has error
        // const { auth } = await import('@/lib/auth');
        // const session = await auth();

        // if (!session) {
        //   return { success: false, message: 'Unauthorized', error: 'Unauthorized' };
        // }

        const total = parseFloat(formData.get('total'));
        const paymentMethod = formData.get('paymentMethod');
        const items = JSON.parse(formData.get('items')); // Array of {productId, quantity}

        // Validate required fields
        if (!total || !paymentMethod || !items || items.length === 0) {
            return { success: false, message: 'Data transaksi tidak lengkap' };
        }

        // Validate payment method
        const validPaymentMethods = ['CASH', 'TRANSFER', 'QRIS'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return { success: false, message: 'Metode pembayaran tidak valid' };
        }

        // Use dummy user ID for now since session is not available
        const userId = '6b65293e-85fc-4e6d-a462-d533cb537e21'; // TODO: Replace with actual user ID when auth is fixed

        // Validate and check stock for each item
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                return { success: false, message: `Produk dengan ID ${item.productId} tidak ditemukan` };
            }

            if (product.stock < parseInt(item.quantity)) {
                return { success: false, message: `Stok produk ${product.name} tidak mencukupi` };
            }
        }

        // Create transaction with items in a transaction
        const transaction = await prisma.$transaction(async (tx) => {
            // Create the main transaction
            const newTransaction = await tx.transaction.create({
                data: {
                    userId,
                    total,
                    paymentMethod,
                }
            });

            // Create transaction items and update product stock
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                await tx.transactionItem.create({
                    data: {
                        transactionId: newTransaction.id,
                        productId: item.productId,
                        quantity: parseInt(item.quantity)
                    }
                });

                // Update product stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: product.stock - item.quantity
                    }
                });
            }

            return newTransaction;
        });

        return { success: true, message: 'Transaksi berhasil dibuat', data: transaction };

    } catch (error) {
        console.error('Error creating transaction:', error);
        return { success: false, message: 'Terjadi kesalahan saat membuat transaksi', error: error.message };
    }
}

export async function getAllTransactions() {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: transactions, message: 'Data transaksi berhasil diambil' };

    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { success: false, message: 'Terjadi kesalahan saat mengambil data transaksi', error: error.message };
    }
}

export async function getTransactionById(id) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });

        if (!transaction) {
            return { success: false, message: 'Transaksi tidak ditemukan' };
        }
        return { success: true, data: transaction, message: 'Data transaksi berhasil diambil' };

    } catch (error) {
        console.error('Error fetching transaction:', error);
        return { success: false, message: 'Terjadi kesalahan saat mengambil data transaksi', error: error.message };
    }
}


export async function deleteTransaction(id) {
    try {
        // Check if transaction exists
        const existingTransaction = await prisma.transaction.findUnique({
            where: {
                id: id
            },
            include: {
                items: true
            }
        });

        if (!existingTransaction) {
            return { success: false, message: 'Transaksi tidak ditemukan' };
        }

        // Only allow deletion for PENDING or FAILED transactions
        if (!['PENDING', 'FAILED'].includes(existingTransaction.status)) {
            return { success: false, message: 'Transaksi yang sudah berhasil tidak dapat dihapus' };
        }

        // Delete transaction and restore product stock
        await prisma.$transaction(async (tx) => {
            // Restore product stock for each item
            for (const item of existingTransaction.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });
            }

            // Delete transaction items first (due to foreign key constraint)
            await tx.transactionItem.deleteMany({
                where: {
                    transactionId: id
                }
            });

            // Delete the transaction
            await tx.transaction.delete({
                where: {
                    id: id
                }
            });
        });

        return { success: true, message: 'Transaksi berhasil dihapus' };

    } catch (error) {
        console.error('Error deleting transaction:', error);
        return { success: false, message: 'Terjadi kesalahan saat menghapus transaksi', error: error.message };
    }
}

export async function getTransactionsByUser(userId) {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: userId
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: transactions, message: 'Data transaksi berhasil diambil' };

    } catch (error) {
        console.error('Error fetching user transactions:', error);
        return { success: false, message: 'Terjadi kesalahan saat mengambil data transaksi user', error: error.message };
    }
}


export async function getTransactionStats() {
    try {
        const [
            totalTransactions,
            pendingTransactions,
            successTransactions,
            failedTransactions,
            totalRevenue,
            todayTransactions,
            todayRevenue
        ] = await Promise.all([
            prisma.transaction.count(),
            prisma.transaction.count({ where: { status: 'PENDING' } }),
            prisma.transaction.count({ where: { status: 'SUCCESS' } }),
            prisma.transaction.count({ where: { status: 'FAILED' } }),
            prisma.transaction.aggregate({
                _sum: { total: true }
            }),
            prisma.transaction.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            prisma.transaction.aggregate({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                },
                _sum: { total: true }
            })
        ]);

        const stats = {
            totalTransactions,
            pendingTransactions,
            successTransactions,
            failedTransactions,
            totalRevenue: totalRevenue._sum.total || 0,
            todayTransactions,
            todayRevenue: todayRevenue._sum.total || 0
        };

        return { success: true, data: stats, message: 'Data statistik transaksi berhasil diambil' };

    } catch (error) {
        console.error('Error fetching transaction stats:', error);
        return { success: false, message: 'Terjadi kesalahan saat mengambil statistik transaksi', error: error.message };
    }
}

export async function searchTransactions(query) {
    try {
        if (!query || query.trim().length === 0) {
            return { success: false, message: 'Query pencarian tidak boleh kosong' };
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    {
                        id: {
                            equals: query
                        }
                    },
                    {
                        user: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: transactions, message: 'Data transaksi berhasil diambil' };

    } catch (error) {
        console.error('Error searching transactions:', error);
        return { success: false, message: 'Terjadi kesalahan saat mencari transaksi', error: error.message };
    }
}
