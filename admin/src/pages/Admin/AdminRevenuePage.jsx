import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#F9A825'];

export default function AdminRevenuePage() {
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const aToken = localStorage.getItem("aToken");



  const fetchRevenueData = async () => {
    try {
      const res = await axios.get(backendUrl+'/api/admin/appointments',{headers:{aToken}}); // Replace with your API route
      console.log(res);
      const appointments = res.data.appointments;

      const revenueMap = {};
      let total = 0;

      appointments.forEach(appt => {
        if (appt.payment) {
          const docId = appt.docId;
          const doctorName = appt.docData?.name || 'Unknown';
          const amount = appt.amount;

          if (!revenueMap[docId]) {
            revenueMap[docId] = { name: doctorName, value: 0 };
          }

          revenueMap[docId].value += amount;
          total += amount;
        }
      });

      const revenueArr = Object.values(revenueMap);
      setRevenueData(revenueArr);
      setTotalRevenue(total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  if (loading) return <p className="p-6">Loading revenue data...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Revenue Overview</h1>
      <p className="text-xl font-semibold">Total Revenue: ₹{totalRevenue}</p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <PieChart width={400} height={300}>
            <Pie
              data={revenueData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {revenueData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold">Doctor-wise Earnings</h2>
          {revenueData.map((doc, index) => (
            <div key={index} className="p-4 border rounded shadow">
              <p className="text-lg font-medium">{doc.name}</p>
              <p>Earnings: ₹{doc.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
