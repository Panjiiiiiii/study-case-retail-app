import { FaMagnifyingGlass } from "react-icons/fa6";
import CardList from "./fragments/card-list";
import { Button } from "@/components/ui/Button";
import { IoIosArrowDown } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { H1, P } from "@/components/ui/Text";
import Barchart from "./components/chart";
import ChartDashboard from "./fragments/chart-dashboard";

export default function page(params) {
    return (
        <div className="flex flex-col justify-start ml-[72px] py-16">
            <H1 className={`text-4xl mb-12`}>Welcome Admin</H1>
            <div className="flex flex-row justify-start mb-5 gap-8">
                <div className="flex flex-col justify-start gap-2 p-8 bg-white rounded-md">
                    <P className={`text-[20px] text-sky-950`}>Total Sold Items Today</P>
                    <H1 className={`text-[32px]`}>180 Items</H1>
                </div>
                <div className="flex flex-col justify-start gap-2 p-8 bg-white rounded-md">
                    <P className={`text-[20px] text-sky-950`}>Total Transaction Today</P>
                    <H1 className={`text-[32px]`}>Rp. 12.000.000,00</H1>
                </div>
                <div className="flex flex-col justify-start gap-4 p-8 bg-white rounded-md">
                    <P className={`text-[20px] text-sky-950`}>Top Sale Product Today</P>
                    <div className={`flex flex-col items-center gap-2 w-full`}>
                        <div className="flex flex-row justify-between w-full">
                            <H1 className={`text-[12px]`}>Product A</H1>
                            <H1 className={`text-[12px]`}>100 Items</H1>
                        </div>
                        <div className="flex flex-row justify-between w-full">
                            <H1 className={`text-[12px]`}>Product A</H1>
                            <H1 className={`text-[12px]`}>100 Items</H1>
                        </div>
                        <div className="flex flex-row justify-between w-full">
                            <H1 className={`text-[12px]`}>Product A</H1>
                            <H1 className={`text-[12px]`}>100 Items</H1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-start mt-8">
                <ChartDashboard/>
            </div>
        </div>
    );
};
