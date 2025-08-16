import Barchart from "../components/chart";
import { weeklyReport } from "../actions/statistic";

export default async function ChartDashboard() {
    // Get real weekly data
    const { soldItems, weekRevenue, weekTransaction } = await weeklyReport();

    return (
        <div className="flex flex-row justify-between gap-8 pr-8">
            <Barchart title="Weekly Sold Items" data={soldItems} xAxisKey="label" showLegend={false} className="flex-1/4"/>
            <Barchart title="Weekly Revenue" data={weekRevenue} xAxisKey="label" showLegend={false} className="flex-1/4"/>
            <Barchart title="Weekly Transactions" data={weekTransaction} xAxisKey="label" showLegend={false} className="flex-1/4"/>
        </div>
    );
}
