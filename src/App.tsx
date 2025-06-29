
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
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
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            } />
            <Route path="/orders" element={
              <AuthGuard>
                <Orders />
              </AuthGuard>
            } />
            <Route path="/inventory" element={
              <AuthGuard requiredRole={['admin', 'purchase']}>
                <Inventory />
              </AuthGuard>
            } />
            <Route path="/reports" element={
              <AuthGuard requiredRole={['admin', 'accounts']}>
                <Reports />
              </AuthGuard>
            } />
            <Route path="/users" element={
              <AuthGuard requiredRole={['admin']}>
                <Users />
              </AuthGuard>
            } />
            <Route path="/settings" element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            } />
            <Route path="/forms/requisition" element={
              <AuthGuard requiredRole={['admin', 'purchase']}>
                <RequisitionSlip />
              </AuthGuard>
            } />
            <Route path="/forms/purchase-order" element={
              <AuthGuard requiredRole={['admin', 'purchase']}>
                <PurchaseOrder />
              </AuthGuard>
            } />
            <Route path="/forms/delivery-challan" element={
              <AuthGuard requiredRole={['admin', 'dispatch']}>
                <DeliveryChallan />
              </AuthGuard>
            } />
            <Route path="/forms/quality-check" element={
              <AuthGuard requiredRole={['admin', 'qc']}>
                <QualityCheck />
              </AuthGuard>
            } />
            <Route path="/forms/material-received" element={
              <AuthGuard requiredRole={['admin', 'purchase']}>
                <MaterialReceived />
              </AuthGuard>
            } />
            <Route path="/forms/proforma" element={
              <AuthGuard requiredRole={['admin', 'sales']}>
                <ProformaInvoice />
              </AuthGuard>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
