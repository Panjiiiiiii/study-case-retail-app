"use client";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

const downloadPDF = (cartItems, totalHarga, paymentMethod = 'CASH') => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [220, 300], // Ukuran struk kecil
    });

    doc.setFont("helvetica");
    doc.setFontSize(12);

    // Header
    doc.text("Njoel E-Mart", 110, 20, { align: "center" });
    doc.text("=========================", 110, 30, { align: "center" });

    // Detail Transaksi
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 10, 45);
    doc.text(`Waktu: ${new Date().toLocaleTimeString("id-ID")}`, 10, 55);
    doc.text(`Metode: ${paymentMethod}`, 10, 65);
    doc.text("=========================", 110, 75, { align: "center" });

    // List Item
    let currentY = 90;
    cartItems.forEach((item) => {
      const itemName = item.product?.name || item.nama || 'Item';
      const itemQty = item.quantity || item.qty || 1;
      const itemPrice = item.product?.price || item.harga || 0;
      const subtotal = item.subtotal || (itemPrice * itemQty);

      doc.text(itemName, 10, currentY); // Nama item
      doc.text(`${itemQty}x`, 10, currentY + 10); // Jumlah
      doc.text(`@${itemPrice.toLocaleString('id-ID')}`, 80, currentY + 10); // Harga satuan
      doc.text(`${subtotal.toLocaleString('id-ID')}`, 150, currentY + 10, { align: "right" }); // Subtotal
      currentY += 25;
    });

    // Total Harga
    doc.text("=========================", 110, currentY + 5, { align: "center" });
    doc.text(`TOTAL: Rp ${totalHarga.toLocaleString('id-ID')}`, 110, currentY + 20, { align: "center" });
    doc.text("=========================", 110, currentY + 30, { align: "center" });
    doc.text("Terima Kasih!", 110, currentY + 45, { align: "center" });

    // Generate filename dengan timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    doc.save(`receipt_${timestamp}.pdf`);
    toast.success("Struk berhasil dicetak!");
  } catch (error) {
    console.error("Gagal membuat struk:", error);
    toast.error("Gagal mencetak struk");
  }
};

export default downloadPDF;
