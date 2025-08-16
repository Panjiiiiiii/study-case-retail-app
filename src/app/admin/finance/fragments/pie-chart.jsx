import { PieChartComponent } from "../../components/chart"
import { salesDistribution } from "../actions/statistic"

export default async function PieChart() {
    // Get real data for top 5 products this week
    const data = await salesDistribution();

    return (
        <>
            <PieChartComponent data={data} title="Weekly Top 5 Products Distribution" className="flex-1 w-full"/>
        </>
    );
};
