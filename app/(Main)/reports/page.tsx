"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getReports } from "@/utils/api";

const COLORS = [
  "#C08497",
  "#D9AE94",
  "#EFD9CE",
  "#A3C4BC",
  "#BFD8B8",
  "#E2E8CE",
  "#C9ADA7",
];

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSubscriptions: 0,
    totalUsers: 0,
    topCities: [{ city: "", clients: "" }],
  });

  const getStats = async () => {
    const res = await getReports();

    setStats(res);
  };

  useEffect(() => {
    getStats();
  }, []);
  const chartData = stats.topCities.map((city) => ({
    ...city,
    clients: parseInt(city.clients) || 0,
  }));
  return (
    <div className="p-6 space-y-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-gray-800"
      >
        Data Reports
      </motion.h1>

      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="bg-green-500 text-white shadow-md">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold">{stats.totalClients}</p>
              <p className="text-lg font-medium mt-2">Total Clients</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="bg-amber-500 text-white shadow-md">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold">{stats.totalSubscriptions}</p>
              <p className="text-lg font-medium mt-2">Subscription</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="bg-orange-500 text-white shadow-md">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold">{stats.totalUsers}</p>
              <p className="text-lg font-medium mt-2">Users</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart + Table Section */}
      <Card className="p-6 shadow-sm">
        <CardHeader>
          <CardTitle>Top Cities</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Pie Chart */}
          <div className="w-full lg:w-1/2 h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="clients"
                >
                  {(stats as any).topCities.map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* City Table */}
          <div className="w-full lg:w-1/2 overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">City</th>
                  <th className="px-4 py-2 text-left font-medium">Clients</th>
                </tr>
              </thead>
              <tbody>
                {(stats as any).topCities.map((city: any, i: any) => (
                  <tr
                    key={city.city}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-2 font-medium text-gray-700">
                      {city.city}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{city.clients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
