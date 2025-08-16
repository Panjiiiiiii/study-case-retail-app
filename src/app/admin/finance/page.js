import { Button } from "@/components/ui/Button";
import { H1, P } from "@/components/ui/Text";
import { MdOutlineInsertDriveFile } from "react-icons/md";
import { PieChartComponent } from "../components/chart";
import PieChart from "./fragments/pie-chart";
import LineChart from "./fragments/line-chart";
import { IoFilter } from "react-icons/io5";
import TableTransaction from "./fragments/table";
import {monthlyProfit} from "./actions/statistic";

export default async function page(params) {
    const profitData = await monthlyProfit();

    // Helper function to format number as Rupiah
    function formatRupiah(number) {
        return "Rp " + number.toLocaleString("id-ID");
    }

    return (
        <div className="flex flex-col justify-start ml-[72px] py-8 pr-8 gap-4">
            <div className="flex flex-row justify-between items-center mb-4">
                <H1 className={`text-4xl`}>Finance Report</H1>
                <Button variant="default" className={"flex items-center gap-2 rounded-4xl"}>
                    <span><MdOutlineInsertDriveFile /></span>
                    <P>Create report</P>
                </Button>
            </div>
            <div className="flex flex-row justify-between gap-4 mb-2">
                <PieChart />
                <LineChart />
                <div className="flex flex-col justify-between w-[404px]">
                    <div className="flex flex-col p-4 h-[120px] bg-white rounded-lg shadow-md">
                        <H1 className="text-xl mb-2">Total Expense This Month</H1>
                        <P className="text-3xl font-bold text-sky-950">{formatRupiah(profitData.monthlyExpense)}</P>
                    </div>
                    <div className="flex flex-col p-4 h-[120px] bg-white rounded-lg shadow-md">
                        <H1 className="text-xl mb-2">Total Income This Month</H1>
                        <P className="text-3xl font-bold text-sky-950">{formatRupiah(profitData.monthlyRevenue)}</P>
                    </div>
                    <div className="flex flex-col p-4 h-[120px] bg-white rounded-lg shadow-md">
                        <H1 className="text-xl mb-2">Total Profit This Month</H1>
                        <P className="text-3xl font-bold text-sky-950">{formatRupiah(profitData.monthlyProfit)}</P>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-start gap-2">
                <div className="flex flex-row justify-start items-center gap-2 mb-2">
                    <H1 className={`text-2xl`}>Transaction History</H1>
                    <Button className={`p-4 rounded-4xl text-sky-950 bg-white`}>
                        <div className="flex flex-row items-center gap-3">
                            <span>Filter</span>
                            <IoFilter size={16} />
                        </div>
                    </Button>
                </div>
                <TableTransaction/>
            </div>
        </div>
    );
};
