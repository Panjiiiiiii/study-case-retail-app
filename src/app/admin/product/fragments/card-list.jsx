"use client";

import MenuCard from "../../components/card";
import { getAllProducts } from "@/app/action/product";
import { useActionState, useEffect } from "react";

const initialState = {
    products: [],
    loading: false,
    error: null
};

// Wrapper function untuk useActionState
async function fetchProductsAction(prevState, formData) {
    try {
        const result = await getAllProducts();
        if (result.success) {
            return {
                products: result.data,
                loading: false,
                error: null
            };
        } else {
            return {
                products: [],
                loading: false,
                error: result.message || 'Failed to fetch products'
            };
        }
    } catch (error) {
        return {
            products: [],
            loading: false,
            error: 'An error occurred while fetching products'
        };
    }
}

export default function CardList() {
    const [state, formAction, isPending] = useActionState(fetchProductsAction, initialState);

    useEffect(() => {
        // Trigger the action on component mount
        formAction();
    }, []);

    if (isPending) {
        return (
            <section>
                <div className="grid grid-cols-5 gap-x-[56px] gap-y-[56px] pb-8">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="h-[360px] bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (state.error) {
        return (
            <section>
                <div className="text-center p-8">
                    <p className="text-red-500 mb-4">{state.error}</p>
                    <button 
                        onClick={() => formAction()} 
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="grid grid-cols-5 gap-x-[56px] gap-y-[56px] pb-8">
                {(!state.products || state.products.length === 0) ? (
                    <p className="col-span-5 text-center text-gray-500">Tidak ada produk.</p>
                ) : (
                    state.products.map((product) => (
                        <MenuCard 
                            key={product.id}
                            product={product}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
