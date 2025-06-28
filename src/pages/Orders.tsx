
import { DashboardLayout } from "@/components/DashboardLayout"
import { OrderDashboard } from "@/components/orders/OrderDashboard"

const Orders = () => {
  return (
    <DashboardLayout 
      title="Order Management" 
      subtitle="Manage orders from creation to delivery with full lifecycle tracking"
    >
      <div className="animate-fade-in">
        <OrderDashboard />
      </div>
    </DashboardLayout>
  );
};

export default Orders;
