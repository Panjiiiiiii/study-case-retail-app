"use client";

import { Button } from "@/components/ui/Button";
import { H1, H2, P } from "@/components/ui/Text";
import { FaMinus, FaPencil, FaPlus, FaTrash } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function MenuCard({ product }) {
    // Format harga ke format Rupiah
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const router = useRouter();

    return (
        <>
            <div className="flex-row p-2 bg-white w-[280px] h-[400px] rounded-xl shadow-md">
                <div className="flex flex-col text-center items-center justify-center h-full">
                    <img 
                        src={product?.imageUrl || "/kecap.png"} 
                        alt="Menu Image" 
                        width={120}
                        height={120}
                        className="w-[120px] h-[120px] object-cover rounded-t-xl mb-4"
                    />
                    <H2 className="text-[18px] font-bold text-sky-950 mb-1">
                        {product?.name || "Kecap Bango 180 ML"}
                    </H2>
                    <P className="text-[12px] font-medium text-gray-400 mb-1">
                        {formatPrice(product?.price || 20000)}
                    </P>
                    <P className="text-[12px] font-medium text-sky-950 mb-2">Stock: {product.stock}</P>
                    <div className="flex flex-row justify-between items-center p-4 gap-2">
                        <Button
                            className={`bg-sky-600 flex flex-row gap-1 items-center rounded-4xl p-2`}
                            icon={<FaPencil className="text-[12px]"/>}
                            onClick={()=>{router.push(`/admin/product/edit/${product.id}`)}}
                        >
                            <P className={`font-light text-[16px]`}>Edit</P>
                        </Button>
                        <Button 
                            variant="danger"
                            className={`bg-red-600 flex flex-row gap-1 items-center rounded-4xl p-2`}
                            icon={<FaTrash className="text-[12px]"/>}
                        >
                            <P className={`font-light text-[16px]`}>Delete</P>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
};