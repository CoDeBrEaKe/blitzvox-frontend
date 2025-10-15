"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const cityData = [
  { name: "Cairo", value: 292 },
  { name: "Alexandria", value: 105 },
  { name: "Tanta", value: 99 },
  { name: "Souhag", value: 67 },
  { name: "Suez", value: 40 },
  { name: "Assiut", value: 20 },
  { name: "Minia", value: 12 },
];

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
              <p className="text-4xl font-bold">1200</p>
              <p className="text-lg font-medium mt-2">Total Clients</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="bg-amber-500 text-white shadow-md">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold">3600</p>
              <p className="text-lg font-medium mt-2">Subscription</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }}>
          <Card className="bg-orange-500 text-white shadow-md">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold">3</p>
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
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cityData.map((entry, index) => (
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
                {cityData.map((city, i) => (
                  <tr
                    key={city.name}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-2 font-medium text-gray-700">
                      {city.name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{city.value}</td>
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
