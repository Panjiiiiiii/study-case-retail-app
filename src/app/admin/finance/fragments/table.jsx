"use client";

import { Button } from "@/components/ui/Button";
import { H1 } from "@/components/ui/Text";
import { useEffect, useState } from "react";
import { FaEye, FaMagnifyingGlass, FaPlus, FaTrash } from "react-icons/fa6";
import { TiArrowSortedDown } from "react-icons/ti";
import Pagination from "../../components/pagination";
import { useRouter } from "next/navigation";
import { getAllTransactions, deleteTransaction } from "@/app/action/transaction";
import TransactionsDetails from "../components/transactions";
import DeleteTransaction from "../components/deleteTransaction";
import toast from "react-hot-toast";
import { Modal } from "../../components/Modal";

// Skeleton Component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

const TableSkeleton = () => (
  <table className="w-full">
    <thead>
      <tr className="bg-sky-950">
        <th className="p-2 text-white text-[16px] text-center">Date</th>
        <th className="p-2 text-white text-[16px] text-center">Total Price</th>
        <th className="p-2 text-white text-[16px] text-center">Payment Method</th>
        <th className="p-2 text-white text-[16px] text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 3 }).map((_, rowIndex) => (
        <tr key={rowIndex} className="bg-white text-center">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <td key={colIndex} className="p-2">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default function TableTransaction(params) {
    const [currentPage, setCurrentPage] = useState(1);
    const [transaction, setTransaction] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const router = useRouter();
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getAllTransactions();
                console.log("Transaction Data:", res);
                if (res.success) {
                    // Sort transactions by date (newest first)
                    const sortedTransactions = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setTransaction(sortedTransactions);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setIsLoading(false);
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
    
    if (isLoading) {
        return (
            <>
                <TableSkeleton />
                <div className="flex justify-center mt-4">
                    <Skeleton className="h-8 w-64" />
                </div>
            </>
        );
    }
    
    return (
        <>
            <table>
                <thead>
                    <tr className="bg-sky-950">
                        <th className="p-2 text-white text-[16px] text-center">Date</th>
                        <th className="p-2 text-white text-[16px] text-center">Total Price</th>
                        <th className="p-2 text-white text-[16px] text-center">Payment Method</th>
                        <th className="p-2 text-white text-[16px] text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems.map((item, index) => (
                        <tr key={index} className="bg-white text-center">
                            <td className="p-2 text-[16px] text-sky-950 text-center">
                                {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </td>
                            <td className="p-2 text-[16px] text-sky-950 text-center">
                                {item.total?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </td>
                            <td className="p-2 text-[16px] text-sky-950 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    {item.paymentMethod}
                                </div>
                            </td>
                            <td className="flex flex-row justify-center items-center text-center gap-4 p-2 text-[16px] text-sky-950">
                                <Button
                                    className={`rounded-full p-2 bg-sky-600 hover:bg-sky-700 text-white`}
                                    onClick={() => openTransactionModal(item)}
                                >
                                    <span className="flex items-center justify-center"><FaEye size={12}/></span>
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
        </>
    );
};