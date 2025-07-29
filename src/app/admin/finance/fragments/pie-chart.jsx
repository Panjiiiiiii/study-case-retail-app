import { PieChartComponent } from "../../components/chart"

export default function PieChart() {
    const data = [
        { name: 'Kecap Bango', value: 45 },
        { name: 'Minyak Goreng', value: 32 },
        { name: 'Gula Pasir', value: 28 },
        { name: 'Beras Premium', value: 15 },
        { name: 'Tepung Terigu', value: 12 },
    ]

    return (
        <>
            <PieChartComponent data={data} title="Sales Distribution" className="flex-1 w-full"/>
        </>
    );
};
