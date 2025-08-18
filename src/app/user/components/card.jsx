"use client";

import { Button } from "@/components/ui/Button";
import { H1, H2, P } from "@/components/ui/Text";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { addToCart, getProductQuantityInCart, updateCartItemQuantity } from "@/lib/cart";
import toast from "react-hot-toast";


export default function MenuCard({ product }) {
    const [quantity, setQuantity] = useState(0);

    // Load quantity dari cart saat component mount dan ketika cart berubah
    useEffect(() => {
        const updateQuantity = () => {
            const cartQuantity = getProductQuantityInCart(product.id);
            setQuantity(cartQuantity);
        };

        // Load initial quantity
        updateQuantity();

        // Listen untuk perubahan cart
        const handleCartUpdate = () => updateQuantity();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [product.id]);

    const addQuantity = () => {
        const currentCartQuantity = getProductQuantityInCart(product.id);
        const availableStock = product.stock - currentCartQuantity;
        
        if (availableStock > 0) {
            addToCart(product.id, 1);
            toast.success(`${product.name} ditambahkan ke keranjang`);
        } else {
            toast.error('Stok tidak mencukupi');
        }
    };

    const minQuantity = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            updateCartItemQuantity(product.id, newQuantity);
            toast.success(`${product.name} dikurangi dari keranjang`);
        }
    };

    // Format harga ke format Rupiah
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            <div className="flex flex-col p-2 bg-white w-[280px] h-[360px] rounded-xl shadow-md">
                <div className="flex flex-col items-center justify-center h-full">
                    <img 
                        src={product?.imageUrl || "/kecap.png"} 
                        alt="Menu Image" 
                        className="w-[120px] h-[120px] object-cover rounded-t-xl mb-4"
                    />
                    <H2 className="text-[18px] font-bold text-sky-950 mb-1">
                        {product?.name || "Kecap Bango 180 ML"}
                    </H2>
                    <P className="text-[12px] font-medium text-gray-400 mb-1">
                        {formatPrice(product?.price || 20000)}
                    </P>
                    <P className="text-[12px] font-medium text-sky-950 mb-2">Stock: {product.stock - quantity}</P>
                    <div className="flex flex-row justify-between items-center p-4 gap-4">
                        <Button 
                            onClick={minQuantity}
                            className={`w-auto h-auto text-[24px] p-[4px] rounded-4xl ${quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={quantity === 0}
                        >
                            <span><FaMinus/></span>
                        </Button>
                        <P className={`text-16 font-semibold min-w-[20px] text-center`}>{quantity}</P>
                        <Button 
                            onClick={addQuantity}
                            className={`w-auto h-auto text-[24px] p-[4px] rounded-4xl ${product.stock - quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={product.stock - quantity === 0}
                        >
                            <span><FaPlus/></span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
};