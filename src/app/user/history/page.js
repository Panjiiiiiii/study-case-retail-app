"use client";

import { Button } from "@/components/ui/Button";
import { H1 } from "@/components/ui/Text";
import { useEffect, useState } from "react";
import { FaEye, FaMagnifyingGlass, FaPlus, FaTrash } from "react-icons/fa6";
import Pagination from "./components/pagination";
import { useRouter } from "next/navigation";
import { getAllTransactions, deleteTransaction } from "@/app/action/transaction";
import TransactionsDetails from "./components/transactions";
import { Modal } from "../components/Modal";
import DeleteTransaction from "./components/deleteTransaction";
import toast from "react-hot-toast";

export default function page(params) {
    const [currentPage, setCurrentPage] = useState(1);
    const [transaction, setTransaction] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const router = useRouter();
    const itemsPerPage = 10;

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

    function openTransactionModal(transactionItem) {
        setSelectedTransaction(transactionItem);
        setIsModalOpen(true);
    }

    function closeModal() {
        setSelectedTransaction(null);
        setIsModalOpen(false);
    }

    function openDeleteModal(transactionItem) {
        setTransactionToDelete(transactionItem);
        setIsDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        setTransactionToDelete(null);
        setIsDeleteModalOpen(false);
    }

    const handleDeleteSuccess = () => {
        if (transactionToDelete) {
            // Refresh data transaksi
            setTransaction(prev => prev.filter(item => item.id !== transactionToDelete.id));
            closeDeleteModal();
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = transaction.slice(startIndex, startIndex + itemsPerPage);
    // Skeleton loading state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const res = await getAllTransactions();
            if (res.success) {
                setTransaction(res.data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col justify-start ml-[72px] py-8 pr-8 gap-4">
            <H1 className={`text-4xl mb-4`}>Transaction History</H1>
            <table>
                <thead>
                    <tr className="bg-sky-950">
                        <th className="p-2 text-white text-[16px]">Date</th>
                        <th className="p-2 text-white text-[16px]">Total Price</th>
                        <th className="p-2 text-white text-[16px]">Payment method</th>
                        <th className="p-2 text-white text-[16px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        // Skeleton rows
                        Array.from({ length: itemsPerPage }).map((_, idx) => (
                            <tr key={idx} className="bg-white text-center animate-pulse">
                                <td className="p-2">
                                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                                </td>
                                <td className="p-2">
                                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                                </td>
                                <td className="p-2">
                                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                                </td>
                                <td className="p-2">
                                    <div className="flex flex-row justify-center gap-4">
                                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        paginatedItems.map((item, index) => (
                            <tr key={index} className="bg-white text-center">
                                <td className="p-2 text-[16px] text-sky-950">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td className="p-2 text-[16px] text-sky-950">
                                    {item.total?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                </td>
                                <td className="p-2 text-[16px] text-sky-950">{item.paymentMethod}</td>
                                <td className="flex flex-row justify-center items-center text-center gap-4 p-2 text-[16px] text-sky-950">
                                    <Button
                                        className={`rounded-full p-2 bg-sky-600 hover:bg-sky-700 text-white`}
                                        onClick={() => openTransactionModal(item)}
                                    >
                                        <span className="flex items-center justify-center"><FaEye size={16}/></span>
                                    </Button>
                                    <Button
                                        className={`rounded-full p-2 bg-red-500 hover:bg-red-600 text-white`}
                                        onClick={() => openDeleteModal(item)}
                                    >
                                        <span className="flex items-center justify-center"><FaTrash size={16}/></span>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalItems={transaction.length}
                itemsPerPage={itemsPerPage}
            />

            {/* Delete Confirmation Modal */}
            {transactionToDelete && (
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    title="Delete transaction"
                >
                    <DeleteTransaction
                        id={transactionToDelete.id}
                        onDelete={handleDeleteSuccess}
                        onCancel={closeDeleteModal}
                    />
                </Modal>
            )}

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title="Transaction Details"
                >
                    <TransactionsDetails
                        id={selectedTransaction.id}
                        onClose={closeModal}
                    />
                </Modal>
            )}
        </div>
    )
};
