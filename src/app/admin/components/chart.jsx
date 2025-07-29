"use client";
import { P } from "@/components/ui/Text";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Line, LineChart } from 'recharts';


export default function Barchart({ 
    data = [], 
    width = "100%", 
    height = 400,
    title = "Chart",
    xAxisKey = "label",
    bars = [
        { key: "value", color: "#052F4A", name: "Value" }
    ],
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    className = ""
}) {
    return (
        <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
            {title && (
                <P className="text-sky-950 mb-4 text-center font-bold text-sm">
                    {title}
                </P>
            )}
            
            <ResponsiveContainer width={width} height={height}>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                    
                    <XAxis 
                        dataKey={xAxisKey}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: '#374151' }}
                    />
                    
                    <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: '#374151' }}
                    />
                    
                    {showTooltip && (
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                            }}
                        />
                    )}
                    
                    {showLegend && <Legend />}
                    
                    {bars.map((bar, index) => (
                        <Bar 
                            key={index}
                            dataKey={bar.key} 
                            fill={bar.color}
                            name={bar.name}
                            radius={[2, 2, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export function PieChartComponent({ 
    data = [], 
    width = "100%", 
    height = 400,
    title = "Pie Chart",
    nameKey = "name",
    valueKey = "value",
    showTooltip = true,
    showLegend = true,
    className = ""
}) {
    // Batasi data maksimal 5 item
    const limitedData = data.slice(0, 5);
    
    // Warna utama dan variasi opacity
    const mainColor = "#052F4A";
    const colors = [
        mainColor,           // 100% opacity
        `${mainColor}CC`,    // 80% opacity
        `${mainColor}99`,    // 60% opacity  
        `${mainColor}66`,    // 40% opacity
        `${mainColor}33`     // 20% opacity
    ];

    // Custom tooltip formatter
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="text-gray-800 font-medium">{`${data.name}`}</p>
                    <p className="text-sky-950 font-semibold">{`Value: ${data.value}`}</p>
                    <p className="text-gray-600 text-sm">{`${((data.value / limitedData.reduce((sum, item) => sum + item[valueKey], 0)) * 100).toFixed(1)}%`}</p>
                </div>
            );
        }
        return null;
    };

    // Custom Legend
    const CustomLegend = ({ payload }) => {
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-700">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
            {title && (
                <P className="text-sky-950 mb-4 text-center font-bold text-sm">
                    {title}
                </P>
            )}
            
            <ResponsiveContainer width={width} height={height}>
                <PieChart>
                    <Pie
                        data={limitedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey={valueKey}
                        nameKey={nameKey}
                    >
                        {limitedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    
                    {showTooltip && <Tooltip content={<CustomTooltip />} />}
                    
                    {showLegend && <Legend content={<CustomLegend />} />}
                </PieChart>
            </ResponsiveContainer>
            
            {data.length > 5 && (
                <P className="text-center text-gray-500 text-xs mt-2">
                    *Showing top 5 items only
                </P>
            )}
        </div>
    );
}

export function LineChartComponent({ 
    data = [], 
    width = "100%", 
    height = 400,
    title = "Line Chart",
    xAxisKey = "name",
    lineKey = "value",
    lineColor = "#052F4A",
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    className = ""
}) {
    return (
        <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
            {title && (
                <P className="text-sky-950 mb-4 text-center font-bold text-sm">
                    {title}
                </P>
            )}
            
            <ResponsiveContainer width={width} height={height}>
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                    
                    <XAxis 
                        dataKey={xAxisKey}
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: '#374151' }}
                    />
                    
                    <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: '#374151' }}
                    />
                    
                    {showTooltip && (
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: '#f9fafb',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px'
                            }}
                        />
                    )}
                    
                    {showLegend && <Legend />}
                    
                    <Line 
                        type="monotone" 
                        dataKey={lineKey} 
                        stroke={lineColor} 
                        strokeWidth={2} 
                        dot={{ r: 3 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};