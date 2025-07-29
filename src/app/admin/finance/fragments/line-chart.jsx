import { LineChartComponent } from "../../components/chart"

export default function LineChart() {
    const data = [
        {name: 'Sun', value: 250000},
        {name: 'Mon', value: 300000},
        {name: 'Tue', value: 200000},
        {name: 'Wed', value: 400000},
        {name: 'Thu', value: 350000},
        {name: 'Fri', value: 450000},
        {name: 'Sat', value: 500000},
    ]
    return (
        <>
            <LineChartComponent data={data} title="Weekly Sales" className="flex-1 w-full"/>
        </>
    )
};
