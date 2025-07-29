"use client";

import { Button } from "@/components/ui/Button";
import { H1 } from "@/components/ui/Text";
import { useState } from "react";
import { FaMagnifyingGlass, FaPlus, FaTrash } from "react-icons/fa6";
import Pagination from "../components/pagination";

export default function page(params) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const logistic = [
        {
            date: "2023-10-01",
            productName: "Product A",
            quantity: 10,
            priceAction: 150000,
        },
        {
            date: "2023-10-02",
            productName: "Product B",
            quantity: 5,
            priceAction: 75000,
        },
        {
            date: "2023-10-03",
            productName: "Product C",
            quantity: 20,
            priceAction: 300000,
        },
        {
            date: "2023-10-04",
            productName: "Product D",
            quantity: 8,
            priceAction: 120000,
        },
        {
            date: "2023-10-05",
            productName: "Product E",
            quantity: 15,
            priceAction: 225000,
        },
        {
            date: "2023-10-05",
            productName: "Product E",
            quantity: 15,
            priceAction: 225000,
        },
    ];

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
                <Button variant="success" className={`rounded-4xl p-4`}>
                    <div className="flex flex-row items-center gap-3">
                        <FaPlus size={16} />
                        <span className="font-medium text-[16px]">Add Item</span>
                    </div>
                </Button>
            </div>
            <table>
                <thead>
                    <tr className="bg-sky-950">
                        <th className="p-4 text-white text-[20px]">Date</th>
                        <th className="p-4 text-white text-[20px]">Product Name</th>
                        <th className="p-4 text-white text-[20px]">Quantity</th>
                        <th className="p-4 text-white text-[20px]">Price Action</th>
                        <th className="p-4 text-white text-[20px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logistic.map((item, index) => (
                        <tr key={index} className="bg-white text-center">
                            <td className="p-8 text-[20px] text-sky-950">{item.date}</td>
                            <td className="p-8 text-[20px] text-sky-950">{item.productName}</td>
                            <td className="p-8 text-[20px] text-sky-950">{item.quantity}</td>
                            <td className="p-8 text-[20px] text-sky-950">{item.priceAction.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td className="p-8 text-[20px] text-sky-950">
                                <Button className={`rounded-full p-2 bg-red-500 hover:bg-red-600 text-white`}>
                                    <span><FaTrash /></span>
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
        </div>
    )
};
