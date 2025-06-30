'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { successResponse, errorResponse, notFoundResponse, badRequestResponse } from '@/lib/response';

/**
 * Create a new transaction
 * @param {Object} formData - Transaction data
 * @returns {NextResponse} - Response with success status and message
 */
export async function createTransaction(formData) {
  try {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const total = parseFloat(formData.get('total'));
    const paymentMethod = formData.get('paymentMethod');
    const items = JSON.parse(formData.get('items')); // Array of {productId, quantity}

    // Validate required fields
    if (!total || !paymentMethod || !items || items.length === 0) {
      return badRequestResponse('Data transaksi tidak lengkap');
    }

        // Validate payment method
        const validPaymentMethods = ['CASH', 'TRANSFER', 'MIDTRANS', 'XENDIT', 'QRIS', 'E_WALLET'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return badRequestResponse('Metode pembayaran tidak valid');
        }

            // Use authenticated user
    const userId = session.user.id;

        // Validate and check stock for each item
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                return notFoundResponse(`Produk dengan ID ${item.productId} tidak ditemukan`);
            }

            if (product.stock < parseInt(item.quantity)) {
                return badRequestResponse(`Stok produk ${product.name} tidak mencukupi`);
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
                    status: 'PENDING'
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
                        quantity: parseInt(item.quantity),
                        priceAtPurchase: product.price
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

        revalidatePath('/transactions');
        revalidatePath('/');

        return successResponse({
            message: 'Transaksi berhasil dibuat',
            data: transaction
        });

    } catch (error) {
        console.error('Error creating transaction:', error);
        return errorResponse('Terjadi kesalahan saat membuat transaksi', 500);
    }
}

/**
 * Get all transactions with user and items details
 * @returns {NextResponse} - Response with array of transactions
 */
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

        return successResponse(transactions);

    } catch (error) {
        console.error('Error fetching transactions:', error);
        return errorResponse('Terjadi kesalahan saat mengambil data transaksi', 500);
    }
}

/**
 * Get a single transaction by ID with details
 * @param {number} id - Transaction ID
 * @returns {NextResponse} - Response with transaction data
 */
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
            return notFoundResponse('Transaksi tidak ditemukan');
        }

        return successResponse(transaction);

    } catch (error) {
        console.error('Error fetching transaction:', error);
        return errorResponse('Terjadi kesalahan saat mengambil data transaksi', 500);
    }
}

/**
 * Update transaction status
 * @param {number} id - Transaction ID
 * @param {string} status - New status
 * @returns {NextResponse} - Response with success status and message
 */
export async function updateTransactionStatus(id, status) {
    try {
        const validStatuses = ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED'];

        if (!validStatuses.includes(status)) {
            return badRequestResponse('Status transaksi tidak valid');
        }

        const transaction = await prisma.transaction.update({
            where: {
                id: id
            },
            data: {
                status
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
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

        revalidatePath('/transactions');
        revalidatePath(`/transactions/${id}`);

        return successResponse({
            message: 'Status transaksi berhasil diperbarui',
            data: transaction
        });

    } catch (error) {
        console.error('Error updating transaction status:', error);

        if (error.code === 'P2025') {
            return notFoundResponse('Transaksi tidak ditemukan');
        }

        return errorResponse('Terjadi kesalahan saat memperbarui status transaksi', 500);
    }
}

/**
 * Delete a transaction (only if status is PENDING or FAILED)
 * @param {number} id - Transaction ID
 * @returns {NextResponse} - Response with success status and message
 */
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
            return notFoundResponse('Transaksi tidak ditemukan');
        }

        // Only allow deletion for PENDING or FAILED transactions
        if (!['PENDING', 'FAILED'].includes(existingTransaction.status)) {
            return badRequestResponse('Transaksi yang sudah berhasil tidak dapat dihapus');
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

        revalidatePath('/transactions');
        revalidatePath('/');

        return successResponse({
            message: 'Transaksi berhasil dihapus'
        });

    } catch (error) {
        console.error('Error deleting transaction:', error);
        return errorResponse('Terjadi kesalahan saat menghapus transaksi', 500);
    }
}

/**
 * Get transactions by user ID
 * @param {number} userId - User ID
 * @returns {NextResponse} - Response with array of user transactions
 */
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

        return successResponse(transactions);

    } catch (error) {
        console.error('Error fetching user transactions:', error);
        return errorResponse('Terjadi kesalahan saat mengambil data transaksi user', 500);
    }
}

/**
 * Get transactions by status
 * @param {string} status - Transaction status
 * @returns {NextResponse} - Response with array of transactions
 */
export async function getTransactionsByStatus(status) {
    try {
        const validStatuses = ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'EXPIRED'];

        if (!validStatuses.includes(status)) {
            return badRequestResponse('Status transaksi tidak valid');
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                status
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

        return successResponse(transactions);

    } catch (error) {
        console.error('Error fetching transactions by status:', error);
        return errorResponse('Terjadi kesalahan saat mengambil data transaksi', 500);
    }
}

/**
 * Get transaction statistics
 * @returns {NextResponse} - Response with transaction statistics
 */
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
                where: { status: 'SUCCESS' },
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
                    status: 'SUCCESS',
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

        return successResponse(stats);

    } catch (error) {
        console.error('Error fetching transaction stats:', error);
        return errorResponse('Terjadi kesalahan saat mengambil statistik transaksi', 500);
    }
}

/**
 * Search transactions by user name or transaction ID
 * @param {string} query - Search query
 * @returns {NextResponse} - Response with filtered transactions
 */
export async function searchTransactions(query) {
    try {
        if (!query || query.trim().length === 0) {
            return badRequestResponse('Query pencarian tidak boleh kosong');
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

        return successResponse(transactions);

    } catch (error) {
        console.error('Error searching transactions:', error);
        return errorResponse('Terjadi kesalahan saat mencari transaksi', 500);
    }
}
