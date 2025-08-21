"use client";
import { FaMagnifyingGlass } from "react-icons/fa6";
import CardList from "./fragments/card-list";
import { Button } from "@/components/ui/Button";
import { IoIosArrowDown } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { useState } from "react";

export default function page(params) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="flex flex-col justify-start h-full ml-[72px] py-8">
            <div className="flex flex-row items-center mb-8 gap-4">
                <div className="relative w-[520px]">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full p-4 pr-12 rounded-full border-none focus:outline-sky-950 placeholder:text-sky-950 bg-white"
                    />
                    <FaMagnifyingGlass
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-950"
                        size={20}
                    />
                </div>
            </div>
            <CardList searchQuery={searchQuery} />
        </div>
    );
};
