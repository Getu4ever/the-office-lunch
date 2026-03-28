import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order: any) => {
  const doc = new jsPDF();

  // 1. Header & Branding
  doc.setFontSize(22);
  doc.setTextColor(179, 45, 58); // Your brand red #b32d3a
  doc.text("THE OFFICE LUNCH", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("INVOICE & RECEIPT", 14, 30);
  doc.text(`Order ID: ${order.orderId.slice(-10).toUpperCase()}`, 14, 35);

  // 2. Event Details Box
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 45, 182, 25, "F");
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("DELIVERY DETAILS", 19, 53);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${order.eventDate}`, 19, 60);
  doc.text(`Slot: ${order.deliverySlot}`, 19, 65);

  // 3. Items Table
  const tableRows = order.items.map((item: any) => [
    item.name,
    item.quantity,
    `£${item.price.toFixed(2)}`,
    `£${(item.price * item.quantity).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 80,
    head: [["Item", "Qty", "Price", "Subtotal"]],
    body: tableRows,
    headStyles: { fillColor: [15, 23, 42] }, // Slate #0f172a
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  // 4. Total
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL PAID: £${order.total.toFixed(2)}`, 140, finalY);

  // 5. Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150);
  doc.text("Thank you for choosing The Office Lunch.", 105, 280, { align: "center" });

  // Save the PDF
  doc.save(`Invoice_OfficeLunch_${order.orderId.slice(-5)}.pdf`);
};