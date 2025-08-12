"use client";

import { Button } from "@/components/ui/Button";
import { H1 } from "@/components/ui/Text";
import { useEffect, useState } from "react";
import { FaEye, FaMagnifyingGlass, FaPlus, FaTrash } from "react-icons/fa6";
import Pagination from "./components/pagination";
import { useRouter } from "next/navigation";
import { getAllTransactions } from "@/app/action/transaction";

export default function page(params) {
    const [currentPage, setCurrentPage] = useState(1);
    const [transaction, setTransaction] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const router = useRouter();
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllTransactions();
            console.log("Transaction Data:", res);
            if (res.success) {
                setTransaction(res.data);
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

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = transaction.slice(startIndex, startIndex + itemsPerPage);
    return (
        <div className="flex flex-col justify-start ml-[72px] py-8 pr-8 gap-4">
            <H1 className={`text-4xl mb-4`}>Logistic History</H1>
            <div className="flex flex-row items-center justify-between mb-5 gap-4">
                <div className="relative w-[520px] flex items-center">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full p-4 pr-12 rounded-full border-none focus:outline-sky-950 placeholder:text-sky-950 bg-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <FaMagnifyingGlass
                            className="text-sky-950"
                            size={20}
                        />
                    </span>
                </div>
            </div>
            <table>
                <thead>
                    <tr className="bg-sky-950">
                        <th className="p-4 text-white text-[20px]">Date</th>
                        <th className="p-4 text-white text-[20px]">Total Price</th>
                        <th className="p-4 text-white text-[20px]">Payment method</th>
                        <th className="p-4 text-white text-[20px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems.map((item, index) => (
                        <tr key={index} className="bg-white text-center">
                            <td className="p-8 text-[20px] text-sky-950">
                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                            </td>
                            <td className="p-8 text-[20px] text-sky-950">
                                {item.total?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </td>
                            <td className="p-8 text-[20px] text-sky-950">{item.paymentMethod}</td>
                            <td className="flex flex-row justify-center items-center text-center gap-4 p-8 text-[20px] text-sky-950">
                                <Button 
                                    className={`rounded-full p-2 bg-sky-600 hover:bg-red-600 text-white`}
                                    onClick={() => openDeleteModal(item)}
                                >
                                    <span className="flex items-center justify-center"><FaEye /></span>
                                </Button>
                                <Button 
                                    className={`rounded-full p-2 bg-red-500 hover:bg-red-600 text-white`}
                                    onClick={() => openDeleteModal(item)}
                                >
                                    <span className="flex items-center justify-center"><FaTrash /></span>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalItems={transaction.length}
                itemsPerPage={itemsPerPage}
            />
        </div>
    )
};
