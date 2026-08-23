import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import AppLayout from "../components/AppLayout";
import { useFetch } from "../hooks/useFetch";
import { cardStyle } from "../utils/styles";

export default function AnalyticsPage() {
  const { data } = useFetch("/analytics", {});
  const colors = ["#4f46e5", "#06b6d4", "#16a34a", "#f59e0b", "#ef4444"];
  const pieData = useMemo(() => data.subjectDistribution || [], [data]);

  return (
    <AppLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Visual insights into study time, subject focus, and revision consistency.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`${cardStyle} p-5`}>
          <h3 className="font-semibold mb-2">Daily Study Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyStudyTime || []}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${cardStyle} p-5`}>
          <h3 className="font-semibold mb-2">Subject Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="minutes" nameKey="subject" outerRadius={90}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
