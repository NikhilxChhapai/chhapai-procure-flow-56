
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF generation');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const generateFormPDF = (formData: any, formType: string) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Header with logo
  pdf.setFontSize(20);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Chhapai', 20, 30);
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Ideas. Realised.', 20, 38);
  
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${formType.toUpperCase()}`, 20, 55);
  
  // Add line
  pdf.setDrawColor(212, 175, 55);
  pdf.line(20, 60, 190, 60);
  
  let yPosition = 75;
  
  // Special formatting for Job Card
  if (formType === 'Job Card') {
    pdf.setFontSize(14);
    pdf.text(`Job Card - ${formData.orderNo}`, 20, yPosition);
    yPosition += 15;
    
    // Customer and Order Info
    pdf.setFontSize(10);
    pdf.text(`Customer: ${formData.customerName}`, 20, yPosition);
    pdf.text(`Product: ${formData.productName}`, 110, yPosition);
    yPosition += 8;
    
    pdf.text(`Quantity: ${formData.quantity}`, 20, yPosition);
    pdf.text(`Order Total: ₹${formData.orderTotal}`, 110, yPosition);
    yPosition += 8;
    
    pdf.text(`Delivery Date: ${formData.deliveryDate}`, 20, yPosition);
    yPosition += 15;
    
    // Production Stages
    pdf.setFontSize(12);
    pdf.text('Production Stages:', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(9);
    if (formData.stages && formData.stages.length > 0) {
      formData.stages.forEach((stage: string, index: number) => {
        pdf.text(`${index + 1}. ${stage}`, 20, yPosition);
        pdf.text('□ Completed', 120, yPosition);
        pdf.text('Assigned to: ________________', 140, yPosition);
        yPosition += 12;
        
        pdf.text('Quality Remarks: ________________________________', 30, yPosition);
        yPosition += 8;
        pdf.text('Notes: ________________________________________', 30, yPosition);
        yPosition += 12;
      });
    }
    
    // Signature section
    yPosition += 10;
    pdf.text('Production Manager Signature: ____________________', 20, yPosition);
    yPosition += 15;
    pdf.text('QC Signature: ____________________', 20, yPosition);
    
  } else {
    // Standard form content
    Object.entries(formData).forEach(([key, value]) => {
      if (value && key !== 'id') {
        pdf.setFontSize(10);
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        pdf.text(`${label}: ${value}`, 20, yPosition);
        yPosition += 8;
        
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 30;
        }
      }
    });
  }
  
  // Terms and Conditions for Proforma Invoice
  if (formType === 'Proforma Invoice') {
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text('Terms & Conditions:', 20, yPosition);
    yPosition += 10;
    
    const terms = [
      '1. Payment: 50% advance, 50% on delivery',
      '2. Delivery: 7-10 working days from approval',
      '3. Validity: This quotation is valid for 30 days',
      '4. Taxes: GST extra as applicable',
      '5. Design approval required before production'
    ];
    
    pdf.setFontSize(9);
    terms.forEach(term => {
      pdf.text(term, 20, yPosition);
      yPosition += 6;
    });
  }
  
  // Terms for Delivery Challan
  if (formType === 'Delivery Challan') {
    yPosition += 15;
    pdf.setFontSize(10);
    pdf.text('Received in good condition:', 20, yPosition);
    yPosition += 15;
    pdf.text('Customer Signature: ____________________', 20, yPosition);
    pdf.text('Date: ____________________', 120, yPosition);
  }
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
  pdf.text('Chhapai - Ideas. Realised.', 20, 285);
  
  const filename = `${formType.replace(/\s+/g, '_')}_${formData.id || formData.orderNo || Date.now()}.pdf`;
  pdf.save(filename);
};
