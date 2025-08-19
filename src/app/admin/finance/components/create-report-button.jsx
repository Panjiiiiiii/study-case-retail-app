"use client";

import { Button } from "@/components/ui/Button";
import { P } from "@/components/ui/Text";
import { MdOutlineInsertDriveFile } from "react-icons/md";
import generateFinanceReport from "@/lib/excelReport";
import { getAllTransactionsForReport, weeklyTransactionDistribution, salesDistribution } from "../actions/statistic";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateReportButton({ profitData }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCreateReport = async () => {
        setIsGenerating(true);
        try {
            // Fetch all required data in parallel
            const [transactionsResult, weeklyDataResult, productDistributionResult] = await Promise.all([
                getAllTransactionsForReport(),
                weeklyTransactionDistribution(),
                salesDistribution()
            ]);
            
            if (transactionsResult.success) {
                // Generate the Excel report with all data
                const success = await generateFinanceReport(
                    profitData, 
                    transactionsResult.data,
                    weeklyDataResult,
                    productDistributionResult
                );
                
                if (success) {
                    toast.success("Laporan berhasil dibuat dan diunduh!");
                } else {
                    toast.error("Gagal membuat laporan");
                }
            } else {
                toast.error("Gagal mengambil data transaksi");
            }
        } catch (error) {
            console.error("Error creating report:", error);
            toast.error("Terjadi kesalahan saat membuat laporan");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button 
            variant="default" 
            className="flex items-center gap-2 rounded-4xl"
            onClick={handleCreateReport}
            disabled={isGenerating}
        >
            <span><MdOutlineInsertDriveFile /></span>
            <P>{isGenerating ? "Creating..." : "Create report"}</P>
        </Button>
    );
}
