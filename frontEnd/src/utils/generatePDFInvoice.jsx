import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// const companyLogo = 'https://via.placeholder.com/80'; // Replace with actual logo/base64

const generatePDFInvoice = (data) => {
  const doc = new jsPDF();

  // Company Logo & Title
  // if (companyLogo) {
    // doc.addImage(companyLogo, 'PNG', 14, 10, 20, 20); // Small logo on top left
  // }
  doc.setFontSize(18);
  doc.setTextColor('#003366'); // Dark blue
  doc.text('MetaTech Salon Booking Invoice', 40, 20);

  // Booking Info (Rounded Rectangle Background)
  doc.setDrawColor(200);
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 30, 180, 30, 'F');

  doc.setFontSize(10);
  doc.setTextColor('#000000');
  doc.text(`Salon Name: ${data.salon_name}`, 16, 38);
  doc.text(`Customer Name: ${data.name}`, 16, 43);
  doc.text(`Booking Date: ${data.date}`, 16, 48);

  doc.text(`Slot: ${data.starting_time} - ${data.ending_time}`, 100, 38);
  doc.text(`Payment Mode: ${data.paymentMode}`, 100, 43);
  doc.text(`Booking Status: ${data.status}`, 100, 48);

  // Table Header Styling
  const services = data.required_services.map((service, index) => [
    index + 1,
    service.name,
    service.gender,
    `${service.estimated_duration} mins`,
    `₹${service.price}`
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['#', 'Service Name', 'Gender', 'Duration', 'Price']],
    body: services,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 102, 204], textColor: 255 }, // Blue header
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Total Amount Box
  const totalAmount = data.required_services.reduce((sum, item) => sum + item.price, 0);
  let finalY = doc.lastAutoTable.finalY + 10;

  doc.setFillColor(240, 255, 240); // Light green background
  doc.rect(130, finalY - 5, 60, 12, 'F');
  doc.setTextColor('#006400'); // Dark green
  doc.setFontSize(12);
  doc.text(`Total Amount: ₹${totalAmount}`, 135, finalY + 3);

  // Footer Text
  doc.setFontSize(10);
  doc.setTextColor('#888888');
  doc.text('Thank you for choosing MetaTech Salon. We value your trust & style!', 14, 285);

  // Save PDF
  doc.save(`Invoice_${data.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};

export default generatePDFInvoice;
