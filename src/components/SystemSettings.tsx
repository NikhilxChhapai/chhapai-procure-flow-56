
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Save } from "lucide-react"

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-chhapai-gold" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="Chhapai" />
            </div>
            <div>
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input id="companyEmail" defaultValue="contact@chhapai.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="companyAddress">Company Address</Label>
            <Input id="companyAddress" defaultValue="123 Business Street, City, State - 123456" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-gray-600">Receive notifications when inventory is low</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Purchase Order Approvals</Label>
              <p className="text-sm text-gray-600">Email notifications for pending approvals</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Quality Check Alerts</Label>
              <p className="text-sm text-gray-600">Notifications for quality check results</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
