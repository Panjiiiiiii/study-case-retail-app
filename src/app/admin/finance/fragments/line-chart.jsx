import { LineChartComponent } from "../../components/chart"
import { weeklyTransactionDistribution } from "../actions/statistic"

export default async function LineChart() {
    // Get real weekly transaction distribution data
    const data = await weeklyTransactionDistribution();

    return (
        <>
            <LineChartComponent data={data} title="Weekly Transaction Distribution" className="flex-1 w-full"/>
        </>
    )
};
