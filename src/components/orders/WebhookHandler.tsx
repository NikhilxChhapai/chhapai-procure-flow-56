
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Webhook, Copy, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function WebhookHandler() {
  const { toast } = useToast()
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    // Generate webhook URL for WooCommerce
    const baseUrl = window.location.origin
    setWebhookUrl(`${baseUrl}/api/webhook/woocommerce`)
  }, [])

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    toast({
      title: "Webhook URL Copied",
      description: "Configure this URL in your WooCommerce webhook settings",
    })
  }

  const handleWebhookData = (orderData: any) => {
    // Process incoming WooCommerce order data
    const processedOrder = {
      id: Date.now(),
      orderNo: `WC-${orderData.id}`,
      customerName: `${orderData.billing.first_name} ${orderData.billing.last_name}`,
      customerContact: orderData.billing.email,
      productName: orderData.line_items[0]?.name || "",
      sku: orderData.line_items[0]?.sku || "",
      quantity: orderData.line_items[0]?.quantity || 0,
      pricePerUnit: parseFloat(orderData.line_items[0]?.price || "0"),
      orderTotal: parseFloat(orderData.total || "0"),
      orderDate: orderData.date_created,
      shippingAddress: `${orderData.shipping.address_1}, ${orderData.shipping.city}`,
      orderNotes: orderData.customer_note || "",
      status: "Pending",
      source: "WooCommerce"
    }

    setRecentOrders(prev => [processedOrder, ...prev.slice(0, 9)])
    
    toast({
      title: "New WooCommerce Order",
      description: `Order ${processedOrder.orderNo} received from ${processedOrder.customerName}`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          WooCommerce Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="webhookUrl">Webhook URL for WooCommerce</Label>
          <div className="flex gap-2 mt-1">
            <Input 
              id="webhookUrl"
              value={webhookUrl}
              readOnly
              className="bg-gray-50"
            />
            <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Add this URL to your WooCommerce webhook settings for order.created events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isListening ? "default" : "secondary"}>
            {isListening ? "Listening" : "Inactive"}
          </Badge>
          <span className="text-sm text-gray-600">
            {recentOrders.length} orders received
          </span>
        </div>

        {recentOrders.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recent WooCommerce Orders</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {recentOrders.map((order, index) => (
                <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{order.orderNo}</span>
                    <Badge variant="outline" className="text-xs">
                      ₹{order.orderTotal}
                    </Badge>
                  </div>
                  <div className="text-gray-600">{order.customerName}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
