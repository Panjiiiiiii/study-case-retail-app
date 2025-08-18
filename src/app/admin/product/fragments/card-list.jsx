"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/app/action/product";
import { getAllCategories } from "@/app/action/category";
import DeleteProduct from "../delete/[id]/deleteProduct";
import { Modal } from "../../components/Modal";
import MenuCard from "../../components/card";
import { P, H1 } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default function CardList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    async function loadProducts() {
        const res = await getAllProducts();
        if (res.success) {
            setProducts(res.data);
            setFilteredProducts(res.data); // Show all products initially
        }
    }

    async function loadCategories() {
        const res = await getAllCategories();
        if (res.success) {
            setCategories(res.data);
        }
    }

    // Filter products based on selected category
    useEffect(() => {
        if (selectedCategory) {
            const filtered = products.filter(product => product.categoryId === selectedCategory.id);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products); // Show all products if no category selected
        }
    }, [selectedCategory, products]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleShowAll = () => {
        setSelectedCategory(null);
    };

    function openDeleteModal(product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }

    function closeModal() {
        setSelectedProduct(null);
        setIsModalOpen(false);
    }

    function handleDeleteSuccess() {
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        closeModal();
    }

    return (
        <>
            {/* Category Filter Buttons */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={handleShowAll}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            !selectedCategory 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                                    ? 'bg-sky-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            <H1 className="mb-6 text-2xl">
                {selectedCategory ? selectedCategory.name : 'All Products'}
            </H1>

            <div className="grid grid-cols-5 gap-x-[44px] gap-y-[56px] pb-8 justify-items-start">
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
                            onDelete={() => openDeleteModal(product)} // 🔹 trigger modal
                        />
                    ))
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title="Hapus Produk"
                >
                    {selectedProduct && (
                        <DeleteProduct
                            id={selectedProduct.id}
                            onDelete={handleDeleteSuccess}
                        />
                    )}
                </Modal>
            </div>
        </>
    );
}
