
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import RequisitionSlip from "./pages/forms/RequisitionSlip";
import PurchaseOrder from "./pages/forms/PurchaseOrder";
import DeliveryChallan from "./pages/forms/DeliveryChallan";
import QualityCheck from "./pages/forms/QualityCheck";
import MaterialReceived from "./pages/forms/MaterialReceived";
import ProformaInvoice from "./pages/forms/ProformaInvoice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/forms/requisition" element={<RequisitionSlip />} />
          <Route path="/forms/purchase-order" element={<PurchaseOrder />} />
          <Route path="/forms/delivery-challan" element={<DeliveryChallan />} />
          <Route path="/forms/quality-check" element={<QualityCheck />} />
          <Route path="/forms/material-received" element={<MaterialReceived />} />
          <Route path="/forms/proforma" element={<ProformaInvoice />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
