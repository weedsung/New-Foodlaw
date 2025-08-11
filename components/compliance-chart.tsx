"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const complianceData = [
  { month: "7월", compliance: 88, products: 12 },
  { month: "8월", compliance: 91, products: 15 },
  { month: "9월", compliance: 89, products: 18 },
  { month: "10월", compliance: 93, products: 20 },
  { month: "11월", compliance: 95, products: 22 },
  { month: "12월", compliance: 94, products: 24 },
]

export function ComplianceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>법규 준수율 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={complianceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="compliance" stroke="#3b82f6" strokeWidth={2} name="준수율 (%)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
