"use client";
import { useState, useEffect } from "react";
import MenuCard from "../components/card";
import { getAllProducts } from "@/app/action/product";

export default function CardList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await getAllProducts();
            setProducts(res.data);
        };
        fetchProducts();
    }, []);


    return (
        <>
        <section>
            <div className="grid grid-cols-5 gap-x-[44px] gap-y-[56px] pb-8">
                {products.map((product) => (
                    <MenuCard 
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
        </>
    );
};
