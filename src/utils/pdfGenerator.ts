
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
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(212, 175, 55); // Chhapai gold
  pdf.text('Chhapai', 20, 30);
  
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${formType.toUpperCase()}`, 20, 45);
  
  // Add line
  pdf.setDrawColor(212, 175, 55);
  pdf.line(20, 50, 190, 50);
  
  let yPosition = 65;
  
  // Form content
  Object.entries(formData).forEach(([key, value]) => {
    if (value && key !== 'id') {
      pdf.setFontSize(10);
      pdf.text(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`, 20, yPosition);
      yPosition += 8;
    }
  });
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
  
  const filename = `${formType}_${formData.id || Date.now()}.pdf`;
  pdf.save(filename);
};
