"use client";

import { Button } from "@/components/ui/Button";
import { H1, H2, P } from "@/components/ui/Text";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useState } from "react";


export default function MenuCard({ product }) {
    const [quantity, setQuantity] = useState(0);
    const [stock, setStock] = useState(product?.stock || 23); // State untuk stock yang bisa berubah

    const addQuantity = () => {
        // Batasi maksimal quantity sesuai stock yang tersedia
        if (quantity < stock) {
            setQuantity(quantity + 1);
            setStock(stock - 1); // Kurangi stock ketika quantity ditambah
        }
    };

    const minQuantity = () => {
        // Pastikan quantity tidak kurang dari 0
        if (quantity > 0) {
            setQuantity(quantity - 1);
            setStock(stock + 1); // Tambah kembali stock ketika quantity dikurangi
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
            <div className="flex-row p-2 bg-white w-[240px] h-[360px] rounded-xl shadow-md">
                <div className="flex flex-col items-center justify-center h-full">
                    <img 
                        src={product?.image || "/kecap.png"} 
                        alt="Menu Image" 
                        className="w- h-auto object-cover rounded-t-xl mb-4"
                    />
                    <H2 className="text-[18px] font-bold text-sky-950 mb-1">
                        {product?.name || "Kecap Bango 180 ML"}
                    </H2>
                    <P className="text-[12px] font-medium text-gray-400 mb-1">
                        {formatPrice(product?.price || 20000)}
                    </P>
                    <P className="text-[12px] font-medium text-sky-950 mb-2">Stock: {stock}</P>
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
                            className={`w-auto h-auto text-[24px] p-[4px] rounded-4xl ${stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={stock === 0}
                        >
                            <span><FaPlus/></span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
};