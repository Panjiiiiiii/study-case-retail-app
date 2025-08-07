"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/app/action/product"; // HARUS client safe
import MenuCard from "../../components/card";
import { P } from "@/components/ui/Text";

export default function CardList() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const result = await getAllProducts();
            if (result.success) setProducts(result.data);
            else setError(result.message);
        }
        fetchData();
    }, []);

    if (error) return <p className="text-red-500">{error}</p>;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const result = await getAllProducts();
            if (result.success) setProducts(result.data);
            else setError(result.message);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return(
        <div className="flex justify-center items-center h-full">
            <P className="text-gray-500">Loading...</P>
        </div>
    )

    return (
        <div className="grid grid-cols-5 gap-x-[44px] gap-y-[56px] pb-8">
            {products.length === 0 ? (
                <P className="col-span-5 text-center text-gray-500">Tidak ada produk.</P>
            ) : (
                products.map(product => (
                    <MenuCard key={product.id} product={product} />
                ))
            )}
        </div>
    );
}
