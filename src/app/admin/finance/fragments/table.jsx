"use client";

import { Button } from "@/components/ui/Button";
import { H1 } from "@/components/ui/Text";
import { useState } from "react";
import { FaEye, FaMagnifyingGlass, FaPlus, FaTrash } from "react-icons/fa6";

import { TiArrowSortedDown } from "react-icons/ti";
import Pagination from "../../components/pagination";

export default function TableTransaction(params) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const logistic = [
        {
            date: "2023-10-01",
            total_price : 150000,
            payment_method: "Cash",
            status: "Paid_off",
        },
        {
            date: "2023-10-02",
            total_price : 75000,
            payment_method: "Bank",
            status: "Pending",
        },
        {
            date: "2023-10-03",
            total_price : 300000,
            payment_method: "Credit Card",
            status: "Paid_off",
        },
        {
            date: "2023-10-04",
            total_price : 120000,
            payment_method: "Cash",
            status: "Pending",
        },
        {
            date: "2023-10-05",
            total_price : 225000,
            payment_method: "Bank",
            status: "Paid_off",
        },
        {
            date: "2023-10-06",
            total_price : 225000,
            payment_method: "Credit Card",
            status: "Pending",
        }
    ];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = logistic.slice(startIndex, startIndex + itemsPerPage);
    return (
        <>
        <table>
            <thead>
                <tr className="bg-sky-950">
                    <th className="p-4 text-white text-[20px] text-center">Date</th>
                    <th className="p-4 text-white text-[20px] text-center">Total Price</th>
                    <th className="p-4 text-white text-[20px] text-center">Payment Method</th>
                    <th className="p-4 text-white text-[20px] text-center">Status</th>
                    <th className="p-4 text-white text-[20px] text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                {paginatedItems.map((item, index) => (
                    <tr key={index} className="bg-white text-center">
                        <td className="p-8 text-[20px] text-sky-950 text-center">{item.date}</td>
                        <td className="p-8 text-[20px] text-sky-950 text-center">{item.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                        <td className="p-8 text-[20px] text-sky-950 text-center">
                            <div className="flex items-center justify-center gap-1">
                                {item.payment_method}
                                <TiArrowSortedDown className="text-[18px]" />
                            </div>
                        </td>
                        <td className="p-8 text-[20px] text-sky-950 text-center">
                            <div className="flex items-center justify-center gap-1">
                                {item.status}
                                <TiArrowSortedDown className="text-[18px]" />
                            </div>
                        </td>                        
                        <td className="p-8 text-[20px] text-sky-950 text-center">
                            <Button className={`rounded-full p-2 bg-[#0084D1] text-white`}>
                                <span><FaEye /></span>
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
        </>
    )
};