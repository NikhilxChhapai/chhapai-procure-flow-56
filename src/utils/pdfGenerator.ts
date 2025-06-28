
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
  
  // Header with logo placeholder (you can add actual logo later)
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
  
  // Form content
  Object.entries(formData).forEach(([key, value]) => {
    if (value && key !== 'id') {
      pdf.setFontSize(10);
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      pdf.text(`${label}: ${value}`, 20, yPosition);
      yPosition += 8;
      
      // Add new page if content is too long
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 30;
      }
    }
  });
  
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
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
  pdf.text('Chhapai - Ideas. Realised.', 20, 285);
  
  const filename = `${formType.replace(/\s+/g, '_')}_${formData.id || Date.now()}.pdf`;
  pdf.save(filename);
};
