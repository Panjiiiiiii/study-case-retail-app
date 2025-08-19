"use client";
import * as XLSX from 'xlsx';
import toast from "react-hot-toast";

const generateFinanceReport = async (profitData, transactions = [], weeklyData = [], productDistribution = []) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Helper function to format currency
    const formatRupiah = (number) => {
      return "Rp " + number.toLocaleString("id-ID");
    };

    // Sheet 1: Monthly Summary
    const summaryData = [
      ["LAPORAN KEUANGAN BULANAN"],
      ["Periode:", profitData.month || "Bulan ini"],
      ["Tanggal Cetak:", new Date().toLocaleDateString("id-ID")],
      [],
      ["RINGKASAN KEUANGAN"],
      ["Total Pengeluaran", formatRupiah(profitData.monthlyExpense || 0)],
      ["Total Pendapatan", formatRupiah(profitData.monthlyRevenue || 0)],
      ["Total Keuntungan", formatRupiah(profitData.monthlyProfit || 0)],
      [],
      ["ANALISIS"],
      ["Margin Keuntungan", (profitData.monthlyRevenue || 0) > 0 ? `${(((profitData.monthlyProfit || 0) / (profitData.monthlyRevenue || 0)) * 100).toFixed(2)}%` : "0%"],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

    // Sheet 2: Transaction Details (if available)
    if (transactions && transactions.length > 0) {
      const transactionHeaders = [
        ["DETAIL TRANSAKSI"],
        [],
        ["Tanggal", "Total", "Metode Pembayaran", "User ID"]
      ];

      const transactionData = transactions.map(transaction => [
        new Date(transaction.createdAt).toLocaleDateString("id-ID"),
        formatRupiah(transaction.total || 0),
        transaction.paymentMethod || "N/A",
        transaction.userId || "N/A"
      ]);

      const allTransactionData = [...transactionHeaders, ...transactionData];
      const transactionSheet = XLSX.utils.aoa_to_sheet(allTransactionData);
      XLSX.utils.book_append_sheet(workbook, transactionSheet, "Detail Transaksi");
    }

    // Sheet 3: Financial Breakdown
    const totalRevenue = profitData.monthlyRevenue || 0;
    const breakdownData = [
      ["BREAKDOWN KEUANGAN"],
      [],
      ["KATEGORI", "NOMINAL", "PERSENTASE"],
      ["Pengeluaran", formatRupiah(profitData.monthlyExpense || 0), totalRevenue > 0 ? `${(((profitData.monthlyExpense || 0) / totalRevenue) * 100).toFixed(2)}%` : "0%"],
      ["Pendapatan", formatRupiah(totalRevenue), "100%"],
      ["Keuntungan", formatRupiah(profitData.monthlyProfit || 0), totalRevenue > 0 ? `${(((profitData.monthlyProfit || 0) / totalRevenue) * 100).toFixed(2)}%` : "0%"],
      [],
      ["CATATAN"],
      ["- Laporan ini dibuat secara otomatis"],
      ["- Data diambil dari sistem pada " + new Date().toLocaleString("id-ID")],
      ["- Untuk informasi lebih detail, hubungi admin sistem"]
    ];

    const breakdownSheet = XLSX.utils.aoa_to_sheet(breakdownData);
    XLSX.utils.book_append_sheet(workbook, breakdownSheet, "Breakdown");

    // Sheet 4: Weekly Sales Chart Data
    if (weeklyData && weeklyData.length > 0) {
      const weeklyHeaders = [
        ["DATA PENJUALAN MINGGUAN"],
        [],
        ["Hari", "Total Penjualan"]
      ];

      const weeklyChartData = weeklyData.map(day => [
        day.name || "N/A",
        formatRupiah(day.value || 0)
      ]);

      // Add summary statistics
      const totalWeeklySales = weeklyData.reduce((sum, day) => sum + (day.value || 0), 0);
      const averageDailySales = totalWeeklySales / 7;
      const maxDaySales = Math.max(...weeklyData.map(day => day.value || 0));
      const minDaySales = Math.min(...weeklyData.map(day => day.value || 0));

      const weeklyStats = [
        [],
        ["STATISTIK MINGGUAN"],
        ["Total Penjualan Minggu Ini", formatRupiah(totalWeeklySales)],
        ["Rata-rata Penjualan Harian", formatRupiah(averageDailySales)],
        ["Penjualan Tertinggi", formatRupiah(maxDaySales)],
        ["Penjualan Terendah", formatRupiah(minDaySales)]
      ];

      const allWeeklyData = [...weeklyHeaders, ...weeklyChartData, ...weeklyStats];
      const weeklySheet = XLSX.utils.aoa_to_sheet(allWeeklyData);
      XLSX.utils.book_append_sheet(workbook, weeklySheet, "Penjualan Mingguan");
    }

    // Sheet 5: Product Distribution (Pie Chart Data)
    if (productDistribution && productDistribution.length > 0) {
      const productHeaders = [
        ["DISTRIBUSI PENJUALAN PRODUK"],
        [],
        ["Nama Produk", "Jumlah Terjual", "Persentase"]
      ];

      // Calculate total quantity for percentage calculation
      const totalQuantity = productDistribution.reduce((sum, product) => sum + (product.value || 0), 0);

      const productChartData = productDistribution.map(product => [
        product.name || "N/A",
        product.value || 0,
        totalQuantity > 0 ? `${((product.value || 0) / totalQuantity * 100).toFixed(2)}%` : "0%"
      ]);

      // Add summary
      const productStats = [
        [],
        ["RINGKASAN PRODUK"],
        ["Total Produk Terjual", totalQuantity],
        ["Jenis Produk", productDistribution.length],
        ["Produk Terlaris", productDistribution.length > 0 ? productDistribution[0].name : "N/A"],
        ["Qty Produk Terlaris", productDistribution.length > 0 ? productDistribution[0].value : 0]
      ];

      const allProductData = [...productHeaders, ...productChartData, ...productStats];
      const productSheet = XLSX.utils.aoa_to_sheet(allProductData);
      XLSX.utils.book_append_sheet(workbook, productSheet, "Distribusi Produk");
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const monthName = profitData.month ? profitData.month.replace(/\s/g, '_') : 'Bulan_Ini';
    const filename = `Laporan_Keuangan_${monthName}_${timestamp}.xlsx`;

    // Write the file
    XLSX.writeFile(workbook, filename);
    
    toast.success("Laporan keuangan berhasil dibuat!");
    return true;
  } catch (error) {
    console.error("Error generating Excel report:", error);
    toast.error("Gagal membuat laporan keuangan");
    return false;
  }
};

export default generateFinanceReport;
