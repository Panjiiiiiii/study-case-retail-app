"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { H2, P } from "@/components/ui/Text";
import { createTransaction } from "@/app/action/transaction";
import downloadPDF from "@/lib/jsPDF";
import toast from "react-hot-toast";

export default function PaymentModal({ cartItems, total, onClose, onSuccess }) {
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
        { value: 'CASH', label: 'Cash' },
        { value: 'TRANSFER', label: 'Bank Transfer' },
        { value: 'QRIS', label: 'QRIS' },
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handlePayment = async () => {
        try {
            setIsProcessing(true);

            // Prepare transaction data
            const formData = new FormData();
            formData.append('total', total.toString());
            formData.append('paymentMethod', paymentMethod);
            
            // Convert cart items to transaction format
            const transactionItems = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
            
            formData.append('items', JSON.stringify(transactionItems));

            const result = await createTransaction(formData);

            if (result.success) {
                toast.success('Pembayaran berhasil!');
                
                // Cetak struk setelah pembayaran berhasil
                try {
                    downloadPDF(cartItems, total, paymentMethod);
                } catch (pdfError) {
                    console.error('PDF generation error:', pdfError);
                    // Jangan gagalkan transaksi jika PDF error
                    toast.error('Pembayaran berhasil, tapi gagal mencetak struk');
                }
                
                onSuccess();
                onClose(); // Clear cart and close modal
                window.location.reload(); // Refresh the page to reflect changes
            } else {
                toast.error(result.message || 'Pembayaran gagal');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Terjadi kesalahan saat memproses pembayaran');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-[500px] overflow-y-auto">
                <H2 className="text-2xl font-bold mb-6 text-center text-sky-950">Payment Confirmation</H2>

                {/* Order Summary */}
                <div className="mb-6">
                    <H2 className="text-lg font-semibold mb-4 text-sky-950">Order Summary</H2>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {cartItems.map((item) => (
                            <div key={item.productId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div className="flex-1">
                                    <P className="font-medium text-sm text-sky-950">{item.product.name}</P>
                                    <P className="text-xs text-gray-500">
                                        {formatPrice(item.product.price)} x {item.quantity}
                                    </P>
                                </div>
                                <P className="font-semibold text-sky-950">{formatPrice(item.subtotal)}</P>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <P className="font-bold text-lg text-sky-950">Total:</P>
                            <P className="font-bold text-lg text-green-600">{formatPrice(total)}</P>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <H2 className="text-lg font-semibold mb-4 text-sky-950">Payment Method</H2>
                    <div className="space-y-2">
                        {paymentMethods.map((method) => (
                            <label key={method.value} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.value}
                                    checked={paymentMethod === method.value}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-3 accent-sky-900"
                                />
                                <P className="font-medium text-sky-950">{method.label}</P>
                            </label>
                        ))}
                    </div>
                </div>         
                <div className="flex gap-4">
                    <Button
                        variant="default"
                        className="flex-1 py-3 rounded-lg"
                        onClick={onClose}
                        disabled={isProcessing}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="success"
                        className="flex-1 py-3 rounded-lg"
                        onClick={handlePayment}
                        disabled={isProcessing || cartItems.length === 0}
                    >
                        {isProcessing ? 'Memproses...' : 'Bayar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
