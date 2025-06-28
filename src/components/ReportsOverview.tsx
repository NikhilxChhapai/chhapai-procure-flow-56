
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, FileText, TrendingUp } from "lucide-react"

export function ReportsOverview() {
  const reports = [
    {
      title: "Monthly Purchase Report",
      description: "Comprehensive purchase analysis for the current month",
      icon: BarChart3,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Inventory Movement Report",
      description: "Track inventory in/out movements and stock levels",
      icon: TrendingUp,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Vendor Performance Report",
      description: "Analyze vendor delivery times and quality metrics",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Department Usage Report",
      description: "Department-wise resource utilization and costs",
      icon: BarChart3,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report, index) => (
          <Card key={index} className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-white ${report.color}`}>
                  <report.icon className="h-5 w-5" />
                </div>
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <div className="flex gap-2">
                <Button className="bg-chhapai-gold hover:bg-chhapai-gold-dark text-chhapai-black">
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
                <Button variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
