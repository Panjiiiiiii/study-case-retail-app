"use client";

import { Button } from "@/components/ui/Button";
import { H1 } from "@/components/ui/Text";
import { EnumInput } from "@/components/ui/Input";
import { useEffect, useState } from "react";
import { FaEye, FaMagnifyingGlass, FaPlus, FaTrash } from "react-icons/fa6";
import Pagination from "./components/pagination";
import { useRouter } from "next/navigation";
import { getAllTransactions, deleteTransaction } from "@/app/action/transaction";
import TransactionsDetails from "./components/transactions";
import { Modal } from "../components/Modal";
import DeleteTransaction from "./components/deleteTransaction";
import { DateInput } from "./components/dateInput";
import toast from "react-hot-toast";

export default function page(params) {
    const [currentPage, setCurrentPage] = useState(1);
    const [transaction, setTransaction] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    // Filter states
    const [dateFilter, setDateFilter] = useState("");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
    const router = useRouter();
    const itemsPerPage = 10;

    // Payment method options for enum input
    const paymentMethodOptions = [
        { value: "", label: "All Payment Methods" },
        { value: "CASH", label: "Cash" },
        { value: "TRANSFER", label: "Transfer" },
        { value: "QRIS", label: "QRIS" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllTransactions();
            console.log("Transaction Data:", res);
            if (res.success) {
                setTransaction(res.data);
                setFilteredTransactions(res.data);
            }
        };
        fetchData();
    }, []);

    // Filter transactions based on date and payment method
    useEffect(() => {
        let filtered = [...transaction];

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Filter by date
        if (dateFilter) {
            filtered = filtered.filter(item => {
                const transactionDate = new Date(item.createdAt).toISOString().split('T')[0];
                return transactionDate === dateFilter;
            });
        }

        // Filter by payment method
        if (paymentMethodFilter) {
            filtered = filtered.filter(item => item.paymentMethod === paymentMethodFilter);
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [transaction, dateFilter, paymentMethodFilter]);

    const handleDateFilterChange = (e) => {
        setDateFilter(e.target.value);
    };

    const handlePaymentMethodFilterChange = (value) => {
        setPaymentMethodFilter(value);
    };

    const clearFilters = () => {
        setDateFilter("");
        setPaymentMethodFilter("");
    };

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
    const paginatedItems = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    // Skeleton loading state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const res = await getAllTransactions();
            if (res.success) {
                setTransaction(res.data);
                setFilteredTransactions(res.data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col justify-start ml-[72px] py-8 pr-8 gap-4">
            <H1 className={`text-4xl mb-4`}>Transaction History</H1>
            
            {/* Filter Section */}
            <div className="rounded-lg mb-4">
                <div className="flex flex-wrap gap-4 items-end">
                    <DateInput
                        label="Filter by Date"
                        name="dateFilter"
                        value={dateFilter}
                        onChange={handleDateFilterChange}
                        className="min-w-[200px]"
                    />
                    <EnumInput
                        label="Payment Method"
                        name="paymentMethodFilter"
                        value={paymentMethodFilter}
                        onChange={handlePaymentMethodFilterChange}
                        options={paymentMethodOptions}
                        className="min-w-[200px]"
                        placeholder="All Payment Methods"
                    />
                    <Button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-3xl"
                    >
                        Clear Filters
                    </Button>
                </div>
                {(dateFilter || paymentMethodFilter) && (
                    <div className="mt-2 text-sm text-gray-600">
                        Showing {filteredTransactions.length} of {transaction.length} transactions
                    </div>
                )}
            </div>
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
                totalItems={filteredTransactions.length}
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
