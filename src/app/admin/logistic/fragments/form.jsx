"use client";

import { Button } from "@/components/ui/Button";
import { EnumInput, FileInput, NumberInput, OptionInput, QtyInput, TextInput } from "@/components/ui/Input";
import { H1, P } from "@/components/ui/Text";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { getAllProducts, getProductById } from "@/app/action/product";
import { useEffect, useState } from "react";

export default function FormLogistic() {
    const [products, setProducts] = useState([]);
    const [listedProducts, setListedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [stock, setStock] = useState(0);
    const [wholesalePrice, setWholesalePrice] = useState(0);
    // Helper to format date as dd/mm/yyyy
    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const addListedProduct = () => {
        if (!selectedProduct) return;
        const product = products.find((p) => p.value === selectedProduct);
        if (product) {
            setListedProducts((prev) => [
                ...prev,
                {
                    id: selectedProduct,
                    name: product.label,
                    stock: stock,
                    wholesalePrice: wholesalePrice
                }
            ]);
            // Reset form fields
            setSelectedProduct("");
            setStock(0);
            setWholesalePrice(0);
        }
    };

    useEffect(() => {
    const fetchProducts = async () => {
        const res = await getAllProducts();
        if (res.success) {
        const options = res.data.map((p) => ({
            label: p.name,
            value: p.id
        }));
        setProducts(options);
        }
    };
    fetchProducts();
    }, []);


    // Function to delete a listed product by index
    const deleteListedProduct = (index) => {
        setListedProducts((prev) => prev.filter((_, i) => i !== index));
    };

    return (
    <div className="bg-white rounded-lg p-12 w-[1200px] h-[760px] mx-auto flex items-center">
        <div className="w-full">
            <H1 className={`text-4xl mb-8`}>Load In Stuff</H1>
            <form className="flex flex-col gap-8 mb-8" onSubmit={e => {e.preventDefault(); addListedProduct();}}>
                <div className="flex flex-row justify-between gap-4 items-center">
                    <div className="flex flex-col gap-4">
                        <label className="text-sky-950 text-xl font-bold">Product Name</label>
                        <EnumInput
                            inputClassName={`h-[60px] w-[280px] rounded-4xl`}
                            name={"productName"}
                            options={products}
                            value={selectedProduct}
                            onChange={e => setSelectedProduct(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-sky-950 text-xl font-bold">Stock</label>
                        <QtyInput
                            inputClassName={`h-[60px] w-[280px] rounded-4xl`}
                            value={stock}
                            onChange={e => setStock(Number(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-sky-950 text-xl font-bold">Wholesale Price</label>
                        <NumberInput
                            placeholder={`Enter wholesale price`}
                            inputClassName={`h-[60px] w-[280px] rounded-4xl`}
                            value={wholesalePrice}
                            onChange={e => setWholesalePrice(Number(e.target.value))}
                        />
                    </div>
                    <Button type="submit" variant="success" className={`rounded-4xl p-4 h-[60px] mt-10`}>
                        <div className="flex flex-row gap-4 items-center align-middle">
                            <span><FaPlus/></span>
                            <P>Add Item</P>
                        </div>
                    </Button>
                </div>
            </form>
            <div className="flex flex-col gap-4">
                <H1 className={`text-2xl mb-4`}>Listed Product At {formatDate(Date.now())}</H1>
                <div className="max-h-52 overflow-y-auto">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-sky-950 z-10">
                    <tr>
                        <th className="text-center p-4 text-white">Product Name</th>
                        <th className="text-center p-4 text-white">Stock</th>
                        <th className="text-center p-4 text-white">Wholesale Price</th>
                        <th className="text-center p-4 text-white">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listedProducts.map((product, index) => (
                        <tr key={`${product.id}-${index}`} className="bg-white border-b">
                        <td className="text-center p-4">{product.name}</td>
                        <td className="text-center p-4">{product.stock}</td>
                        <td className="text-center p-4">Rp {product.wholesalePrice}</td>
                        <td className="text-center p-4">
                            <Button variant="danger" className="rounded-4xl p-2" onClick={() => deleteListedProduct(index)}>
                            <span><FaTrash size={16} /></span>
                            </Button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <div className="flex justify-end">
                    <Button variant="success" className={`rounded-4xl py-2`}><P className={`text-lg`}>Submit</P></Button>
                </div>
            </div>
        </div>
    </div>
    );
};
