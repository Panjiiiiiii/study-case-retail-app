"use client";

import { Button } from "@/components/ui/Button";
import { H1 } from "@/components/ui/Text";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass, FaPlus, FaTrash } from "react-icons/fa6";
import Pagination from "../components/pagination";
import { useRouter } from "next/navigation";
import { getInventory } from "@/app/action/inventory";
import { Modal } from "../components/Modal";
import DeleteInventory from "./delete/[id]/deleteInventory";


export default function page(params) {
    const [currentPage, setCurrentPage] = useState(1);
    const [logistic, setLogistic] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            const res = await getInventory();
            console.log("Logistic Data:", res);
            if (res.success) {
                setLogistic(res.data);
            }
        };
        fetchData();
    }, []);

    function openDeleteModal(inventory) {
        setSelectedInventory(inventory);
        setIsModalOpen(true);
    }

    function closeModal() {
        setSelectedInventory(null);
        setIsModalOpen(false);
    }

    function handleDeleteSuccess() {
        setLogistic(prev => prev.filter(item => item.id !== selectedInventory.id));
        closeModal();
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = logistic.slice(startIndex, startIndex + itemsPerPage);
    return (
        <div className="flex flex-col justify-start ml-[72px] py-8 pr-8 gap-4">
            <H1 className={`text-4xl mb-4`}>Logistic History</H1>
            <div className="flex flex-row items-center justify-between mb-5 gap-4">
                <div className="relative w-[520px]">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full p-4 pr-12 rounded-full border-none focus:outline-sky-950 placeholder:text-sky-950 bg-white"
                    />
                    <FaMagnifyingGlass
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-950"
                        size={20}
                    />
                </div>
                <Button variant="success" className={`rounded-4xl p-4`} onClick={() => router.push('/admin/logistic/add')}>
                    <div className="flex flex-row items-center gap-3">
                        <FaPlus size={16} />
                        <span className="font-medium text-[16px]">Add Item</span>
                    </div>
                </Button>
            </div>
            <table>
                <thead>
                    <tr className="bg-sky-950">
                        <th className="p-2 text-white text-[16px]">Date</th>
                        <th className="p-2 text-white text-[16px]">Product Name</th>
                        <th className="p-2 text-white text-[16px]">Quantity</th>
                        <th className="p-2 text-white text-[16px]">Price Action</th>
                        <th className="p-2 text-white text-[16px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems.map((item, index) => (
                        <tr key={index} className="bg-white text-center">
                            <td className="p-2 text-[16px] text-sky-950">
                            {new Date(item.date).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                            </td>
                            <td className="p-2 text-[16px] text-sky-950">{item.product || 'Unknown Product'}</td>
                            <td className="p-2 text-[16px] text-sky-950">{item.quantity}</td>
                            <td className="p-2 text-[16px] text-sky-950">
                            {item?.price
                                ? item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                                : 'Rp 0'}
                            </td>
                            <td className="p-2 text-[16px] text-sky-950">
                                <Button 
                                    className={`rounded-full p-2 bg-red-500 hover:bg-red-600 text-white`}
                                    onClick={() => openDeleteModal(item)}
                                >
                                    <span><FaTrash size={12}/></span>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalItems={logistic.length}
                itemsPerPage={itemsPerPage}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Hapus Inventory"
            >
                {selectedInventory && (
                    <DeleteInventory
                        id={selectedInventory.id}
                        onDelete={handleDeleteSuccess}
                        onCancel={closeModal}
                    />
                )}
            </Modal>
        </div>
    )
};
