"use server";

import { FaMagnifyingGlass } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { IoIosArrowDown } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { H1, P } from "@/components/ui/Text";
import Barchart from "./components/chart";
import ChartDashboard from "./fragments/chart-dashboard";
import { getSumTransaction, topSaleProducts } from "./actions/statistic";

export default async function page(params) {
    const transaction = await getSumTransaction();
    const topProducts = await topSaleProducts();


    return (
        <div className="flex flex-col justify-start ml-[72px] py-16 mr-[72px]">
            <H1 className={`text-4xl mb-12`}>Welcome Admin</H1>
            <div className="flex flex-row justify-start mb-5 gap-8 w-auto">
                <div className="flex flex-col justify-start p-8 bg-white rounded-md w-[320px] h-auto">
                    <P className={`text-[20px] text-sky-950 font-bold`}>Total Sold Items Today</P>
                    <H1 className={`text-[32px] mt-2 mb-0`}>{transaction.soldItems} items</H1>
                </div>
                <div className="flex flex-col justify-start gap-2 p-8 bg-white rounded-md w-[320px] h-auto">
                    <P className={`text-[20px] text-sky-950 font-bold`}>Total Transaction Today</P>
                    <H1 className={`text-[32px]`}>
                        {transaction.totalRevenue.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </H1>
                </div>
                <div className="flex flex-col justify-start gap-4 p-8 bg-white rounded-md w-[400px] h-auto">
                    <P className={`text-[20px] text-sky-950`}>Top Sale Product Today</P>
                    <div className={`flex flex-col items-center gap-2 w-full`}>
                        {topProducts.length === 0 ? (
                            <P className="text-[14px] text-gray-500">Tidak ada produk terjual hari ini</P>
                        ) : (
                            topProducts.map(product => (
                                <div key={product.product.id} className="flex flex-row justify-between w-full">
                                    <H1 className={`text-[12px]`}>{product.product.name}</H1>
                                    <H1 className={`text-[12px]`}>{product.qty} Items</H1>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-start mt-8">
                <ChartDashboard />
            </div>
        </div>
    );
};
