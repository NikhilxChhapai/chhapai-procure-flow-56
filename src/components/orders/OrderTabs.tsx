
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, PlayCircle, CheckCircle } from "lucide-react"
import { PendingOrders } from "./PendingOrders"
import { InProgressOrders } from "./InProgressOrders"
import { CompletedOrders } from "./CompletedOrders"

export function OrderTabs() {
  const [pendingCount] = useState(23)
  const [inProgressCount] = useState(34)
  const [completedCount] = useState(99)

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pending" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pending Orders
          <Badge variant="secondary">{pendingCount}</Badge>
        </TabsTrigger>
        <TabsTrigger value="in-progress" className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4" />
          In-Progress
          <Badge variant="secondary">{inProgressCount}</Badge>
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Completed
          <Badge variant="secondary">{completedCount}</Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="mt-6">
        <PendingOrders />
      </TabsContent>
      
      <TabsContent value="in-progress" className="mt-6">
        <InProgressOrders />
      </TabsContent>
      
      <TabsContent value="completed" className="mt-6">
        <CompletedOrders />
      </TabsContent>
    </Tabs>
  )
}
