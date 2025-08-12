"use client";
import { Button } from "@/components/ui/Button";
import { H1, P } from "@/components/ui/Text";
import { FaCartShopping, FaTrash } from "react-icons/fa6";
import { useCartData } from "@/hooks/useCartData";
import { clearCart, removeFromCart } from "@/lib/cart";
import toast from "react-hot-toast";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";
import { Modal } from "../components/Modal";

export default function CartList({ onClose }) {
  const { cartItems, total, totalQuantity, loading, refreshCart } = useCartData();
  const [isClearing, setIsClearing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Format harga ke format Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Handle remove item dari cart
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    refreshCart();
    toast.success('Item dihapus dari keranjang');
  };

  // Handle clear seluruh cart
  const handleClearCart = () => {
    setIsClearing(true);
    clearCart();
    refreshCart();
    toast.success('Keranjang dikosongkan');
    setIsClearing(false);
  };

  // Handle payment
  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    refreshCart();
    setShowPaymentModal(false);
    toast.success('Transaksi berhasil!');
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <aside className="w-[400px] bg-[#E5E7EB] flex flex-col justify-center items-center h-screen shadow-lg">
        <P>Loading...</P>
      </aside>
    );
  }

  return (
    <>
      <aside className="w-[400px] bg-[#E5E7EB] flex flex-col justify-between h-screen shadow-lg">
        <div className="flex flex-col align-middle justify-start p-8 overflow-y-auto">
          <H1 className="mb-8 text-3xl text-center">Detail Transaction</H1>
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col text-center gap-8 items-center align-middle">
                <img src="/trolley.png" width={128} alt="Empty Cart" className="" />
                <P className="text-gray-500">Keranjang kosong</P>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between bg-white p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl || "/kecap.png"}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <P className="font-medium text-[14px] text-sky-950 line-clamp-2">
                        {item.product.name}
                      </P>
                      <P className="text-[12px] text-gray-500">
                        {formatPrice(item.product.price)}
                      </P>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <P className="text-[16px] text-sky-950 font-semibold min-w-[40px] text-center">
                      X{item.quantity}
                    </P>
                    <Button
                      variant="danger"
                      className="p-1 rounded"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <FaTrash size={12} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

          <div className="p-8 border-t border-gray-300">
            <div className="flex flex-row justify-between items-center py-4">
              <P className="font-medium text-sky-950 text-center">Total ({totalQuantity} items)</P>
              <P className="font-bold text-lg text-sky-950 text-center">{formatPrice(total)}</P>
            </div>
            <div className="flex flex-row justify-center gap-4 mt-4">
              <Button 
                variant="default" 
                className="flex flex-row items-center justify-center text-center gap-2 px-4 py-2 rounded-4xl text-lg font-medium w-full"
                onClick={handlePayment}
                disabled={cartItems.length === 0}
              >
                <FaCartShopping />
                Payment
              </Button>
              <Button 
                variant="danger" 
                className="flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-4xl text-lg font-medium"
                onClick={handleClearCart}
                disabled={cartItems.length === 0 || isClearing}
              >
                <FaTrash />
                Clear
              </Button>
            </div>
          </div>
        </aside>
      {showPaymentModal && (
        <Modal isOpen={showPaymentModal} onClose={handleClosePaymentModal} hideClose={true} title={'Payment'}>
          <PaymentModal
            cartItems={cartItems}
            total={total}
            onClose={handleClosePaymentModal}
            onSuccess={handlePaymentSuccess}
          />
        </Modal>
      )}
    </>
  );
}
