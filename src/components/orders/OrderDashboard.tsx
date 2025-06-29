
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ClipboardList } from "lucide-react"
import { OrderForm } from "./OrderForm"
import { OrderStats } from "./OrderStats"
import { OrderTabs } from "./OrderTabs"
import { WebhookHandler } from "./WebhookHandler"

export function OrderDashboard() {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOrderCreated = () => {
    setShowOrderForm(false)
    setRefreshKey(prev => prev + 1)
  }

  if (showOrderForm) {
    return (
      <OrderForm 
        onClose={() => setShowOrderForm(false)}
        onOrderCreated={handleOrderCreated}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-chhapai-gold" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
            <p className="text-gray-600">Complete order lifecycle from WooCommerce to delivery</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowOrderForm(true)}
          className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Manual Order
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <OrderStats />
        </div>
        <div>
          <WebhookHandler />
        </div>
      </div>

      <OrderTabs key={refreshKey} />
    </div>
  )
}
