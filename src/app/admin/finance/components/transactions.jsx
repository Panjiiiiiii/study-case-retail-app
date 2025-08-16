"use client";
import { getTransactionById } from "@/app/action/transaction";
import { Button } from "@/components/ui/Button";
import { H2, P } from "@/components/ui/Text";
import { useState, useEffect } from "react";

export default function TransactionsDetails({ id, onClose }) {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    // Format harga ke format Rupiah
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Format tanggal
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                setLoading(true);
                const response = await getTransactionById(id);
                if (response.success) {
                    console.log('Transaction data:', response.data);
                    setTransaction(response.data);
                } else {
                    console.error('Failed to fetch transaction:', response.message);
                }
            } catch (error) {
                console.error('Error fetching transaction:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTransaction();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <P className="text-center">Loading...</P>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="text-center py-8">
                <P className="text-red-500 mb-4">Tranaction Not Found</P>
                <Button onClick={onClose} variant="default" className="px-6 py-2 rounded-lg">
                    Tutup
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-h-[70vh] overflow-y-auto">
            {/* Transaction Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <P className="font-medium text-sky-950">Transaction ID:</P>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <P className="font-medium text-sky-950">Date:</P>
                    <P className="text-sm text-gray-600">{formatDate(transaction.transactionDate)}</P>
                </div>
                <div className="flex justify-between items-center">
                    <P className="font-medium text-sky-950">Payment Method:</P>
                    <P className="text-sm text-gray-600">{transaction.paymentMethod}</P>
                </div>
            </div>

            {/* Order Summary */}
            <div className="mb-6">
                <H2 className="text-lg font-semibold mb-4 text-sky-950">Order Summary</H2>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {transaction.items.map((item) => (
                        <div key={item.productId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                                <P className="font-medium text-sm text-sky-950">{item.productName}</P>
                                <P className="text-xs text-gray-500">
                                    {formatPrice(item.productPrice)} x {item.quantity}
                                </P>
                            </div>
                            <P className="font-semibold text-sky-950">{formatPrice(item.subtotal)}</P>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                        <P className="font-bold text-lg text-sky-950">Total:</P>
                        <P className="font-bold text-lg text-green-600">{formatPrice(transaction.totalPrice)}</P>
                    </div>
                </div>
            </div>
            
            {/* Close Button */}
            <div className="flex justify-center">
                <Button
                    variant="default"
                    className="px-8 py-3 rounded-lg"
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        </div>
    );
}
