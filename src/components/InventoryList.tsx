
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, AlertTriangle, Package } from "lucide-react"

const sampleInventory = [
  { id: 1, name: "Office Paper A4", sku: "SKU001", category: "Stationery", quantity: 25, minStock: 50, price: 250, location: "Store A" },
  { id: 2, name: "Printer Cartridge", sku: "SKU002", category: "Electronics", quantity: 8, minStock: 10, price: 1200, location: "Store B" },
  { id: 3, name: "Steel Pipes", sku: "SKU003", category: "Construction", quantity: 45, minStock: 20, price: 850, location: "Warehouse" },
  { id: 4, name: "Safety Helmets", sku: "SKU004", category: "Safety", quantity: 5, minStock: 15, price: 450, location: "Store A" },
]

export function InventoryList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inventory] = useState(sampleInventory)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (quantity <= minStock) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-chhapai-gold" />
            Inventory Items
          </CardTitle>
          <Button className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredInventory.map((item) => {
            const stockStatus = getStockStatus(item.quantity, item.minStock)
            return (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    {item.quantity <= item.minStock && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <span><strong>SKU:</strong> {item.sku}</span>
                    <span><strong>Category:</strong> {item.category}</span>
                    <span><strong>Location:</strong> {item.location}</span>
                    <span><strong>Price:</strong> ₹{item.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-chhapai-gold">{item.quantity}</div>
                  <div className="text-sm text-gray-500">Available</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
