import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import "./TodayAttendance.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TodayAttendance() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/attendance/students-today-summary`,
          { withCredentials: true } // 👈 Send cookies on DELETE also
        );
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching today's attendance summary:", error);
      }
    };

    fetchAttendanceSummary();
  }, []);

  if (!summary) {
    return <div className="today-attendance">Loading today's summary...</div>;
  }

  const percentage = ((summary.present / summary.total) * 100).toFixed(2);

  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Today's Attendance",
        data: [summary.present, summary.total - summary.present],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
      },
    ],
  };

  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="today-attendance">
      <h2>Student Attendance Summary</h2>
      <p className="date">{dateStr}</p>
      <div className="summary-card">
        <div><strong>Present Students:</strong> {summary.present}</div>
        <div><strong>Total Students:</strong> {summary.total}</div>
        <div><strong>Attendance %:</strong> {percentage}%</div>
      </div>

      <div className="chart-wrapper">
        <Pie data={data} />
      </div>
    </div>
  );
}
