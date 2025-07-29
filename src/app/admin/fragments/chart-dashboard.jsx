import Barchart from "../components/chart";

const dummySoldItems = [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 90 },
    { label: "Wed", value: 150 },
    { label: "Thu", value: 80 },
    { label: "Fri", value: 200 },
    { label: "Sat", value: 170 },
    { label: "Sun", value: 100 },
];

const dummyOmzet = [
    { label: "Mon", value: 1000000 },
    { label: "Tue", value: 800000 },
    { label: "Wed", value: 1200000 },
    { label: "Thu", value: 700000 },
    { label: "Fri", value: 1500000 },
    { label: "Sat", value: 1300000 },
    { label: "Sun", value: 900000 },
];

const dummyTransaction = [
    { label: "Mon", value: 30 },
    { label: "Tue", value: 25 },
    { label: "Wed", value: 40 },
    { label: "Thu", value: 20 },
    { label: "Fri", value: 50 },
    { label: "Sat", value: 45 },
    { label: "Sun", value: 28 },
];

export default function ChartDashboard() {
    return (
        <div className="flex flex-row justify-between gap-8 pr-8">
            <Barchart title="Weekly Sold Items" data={dummySoldItems} xAxisKey="label" showLegend={false} className="flex-1/4"/>
            <Barchart title="Weekly Revenue" data={dummyOmzet} xAxisKey="label" showLegend={false} className="flex-1/4"/>
            <Barchart title="Weekly Transactions" data={dummyTransaction} xAxisKey="label" showLegend={false} className="flex-1/4"/>
        </div>
    );
}
