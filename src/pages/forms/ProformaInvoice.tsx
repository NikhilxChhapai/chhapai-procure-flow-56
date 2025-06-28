
import { DashboardLayout } from "@/components/DashboardLayout"
import { ProformaInvoiceForm } from "@/components/forms/ProformaInvoiceForm"

const ProformaInvoice = () => {
  return (
    <DashboardLayout 
      title="Proforma Invoice" 
      subtitle="Create proforma invoices with terms and conditions."
    >
      <div className="animate-fade-in">
        <ProformaInvoiceForm />
      </div>
    </DashboardLayout>
  );
};

export default ProformaInvoice;
