"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/app/action/product";
import DeleteProduct from "../delete/[id]/deleteProduct";
import { Modal } from "../../components/Modal";
import MenuCard from "../../components/card";
import { P } from "@/components/ui/Text";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const res = await getAllProducts();
        if (res.success) setProducts(res.data);
    }

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
        <div className="grid grid-cols-5 gap-x-[44px] gap-y-[56px] pb-8">
            {products.length === 0 ? (
                <P className="col-span-5 text-center text-gray-500">
                    Tidak ada produk.
                </P>
            ) : (
                products.map(product => (
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
    );
}
