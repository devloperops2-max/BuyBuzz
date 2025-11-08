'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DollarSign, Package, Users, Activity, ArrowUpRight } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const generateChartData = () => {
  const data = [];
  const today = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = monthNames[d.getMonth()];
    // Generate some random-but-realistic data
    const revenue = Math.floor(Math.random() * (5000 - 1500 + 1)) + 1500;
    const profit = Math.floor(revenue * (Math.random() * (0.7 - 0.4) + 0.4));
    data.push({ month, revenue, profit });
  }
  return data;
};

const chartData = generateChartData();


const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-headline">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground flex items-center">
               <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">Total products available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">Users currently browsing</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs. Profit</CardTitle>
            <CardDescription>Last 6 months performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} name="Revenue"/>
                <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} name="Profit"/>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
