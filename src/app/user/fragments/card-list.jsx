"use client";
import { useState, useEffect } from "react";
import MenuCard from "../components/card";
import { getAllProducts } from "@/app/action/product";
import { H1, P } from "@/components/ui/Text";
import { getAllCategories } from "@/app/action/category";
import { Button } from "@/components/ui/Button";

export default function CardList({ searchQuery }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Ensure searchQuery is always a string
    const safeSearchQuery = searchQuery || "";

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getAllCategories();
            console.log("Categories:", res);
            if (res.success) {
                setCategories(res.data);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await getAllProducts();
            console.log("Products:", res);
            if (res.success) {
                setProducts(res.data);
                setFilteredProducts(res.data); // Show all products initially
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on selected category and search query
    useEffect(() => {
        let filtered = products;

        // Filter by category first
        if (selectedCategory) {
            filtered = filtered.filter(product => product.categoryId === selectedCategory.id);
        }

        // Then filter by search query
        if (safeSearchQuery && safeSearchQuery.trim()) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(safeSearchQuery.toLowerCase()) ||
                (product.category?.name && product.category.name.toLowerCase().includes(safeSearchQuery.toLowerCase()))
            );
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, products, safeSearchQuery]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleShowAll = () => {
        setSelectedCategory(null);
    };


    return (
        <>
            {/* Category Filter Buttons */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={handleShowAll}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            !selectedCategory 
                                ? 'bg-orange-600 text-white' 
                                : 'bg-transparent text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All Products
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory?.id === category.id 
                                    ? 'bg-orange-600 text-white' 
                                    : 'bg-transparent text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            <H1 className="mb-6 text-4xl">
                {selectedCategory ? selectedCategory.name : 'All Products'}
            </H1>
            <div className="grid grid-cols-5 xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-x-[44px] gap-y-[56px] pb-8 justify-items-start">
                {filteredProducts.length === 0 ? (
                    <P className="col-span-5 text-center text-gray-500 justify-self-center">
                        {selectedCategory 
                            ? `Tidak ada produk dalam kategori ${selectedCategory.name}.`
                            : 'Tidak ada produk.'
                        }
                    </P>
                        ) : (
                        filteredProducts.map(product => (
                        <MenuCard
                            key={product.id}
                            product={product}
                        />
                    ))
                )}
            </div>
        </>
    );
};
