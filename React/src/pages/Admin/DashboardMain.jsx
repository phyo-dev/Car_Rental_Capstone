// src/pages/Admin/DashboardMain.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardMain = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data for charts (you can replace this with API data)
  const barChartData = [
    { name: "Agency 1", orders: 12 },
    { name: "Agency 2", rents: 19 },
    { name: "Agency 3", orders: 8 },
    { name: "Agency 4", rents: 15 },
  ];

  const pieChartData = [
    { name: "Agency 1", value: 20 },
    { name: "Agency 2", value: 20 },
    { name: "Agency 3", value: 20 },
    { name: "Agency 4", value: 20 },
    { name: "Agency 5", value: 20 },
  ];

  const donutChartData = [
    { name: "Orders", value: 60 },
    { name: "Rents", value: 40 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const DONUT_COLORS = ["#36A2EB", "#4BC0C0"];

  useEffect(() => {
    // Fetch best sellers data
    const fetchBestSellers = async () => {
      try {
        const response = await axiosInstance.get("/admin/best-sellers"); // Replace with your API endpoint
        setBestSellers(response.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className="content-container">
      {/* Charts */}
      <div className="charts">
        {/* Donut Chart using Recharts */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={donutChartData}
                cx="50%"
                cy="50%"
                innerRadius={60} // Creates the donut effect
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {donutChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#6366F1" name="Orders" />
              <Bar dataKey="rents" fill="#22C55E" name="Rents" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieChartData.map((entry, index) => (
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
      </div>

      {/* Best Sellers Table */}
      <div className="best-sellers">
        <h3>Best Sellers</h3>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Total Income</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">Loading...</td>
              </tr>
            ) : bestSellers.length === 0 ? (
              <tr>
                <td colSpan="3">No data available</td>
              </tr>
            ) : (
              bestSellers.map((seller, index) => (
                <tr key={seller.id}>
                  <td>{index + 1}</td>
                  <td>{seller.name}</td>
                  <td>{seller.totalIncome}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardMain;