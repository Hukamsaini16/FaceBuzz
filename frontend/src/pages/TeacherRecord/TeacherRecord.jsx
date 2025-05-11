import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import "./TeacherRecord.css";

const TeacherRecord = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    fetchAttendance();
    fetchHolidays();
  }, [selectedMonth]);

  const fetchHolidays = async () => {
    try {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() ; // zero-indexed
      const res = await axios.get(
        `${BASE_URL}/api/holidays/month?year=${year}&month=${month}`,
        { withCredentials: true } // 👈 Send cookies on DELETE also
      );
      setHolidays(res.data);
      console.log(res.data) ;// array of "YYYY-MM-DD"
    } catch (err) {
      console.error("Error fetching holidays", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth();
      const res = await axios.get(
        `${BASE_URL}/api/teachers/monthly-attendance?year=${year}&month=${month}`,
        { withCredentials: true } // 👈 Send cookies on DELETE also
      );
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching teacher attendance", err);
    }
  };

  const getDaysInMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  
  const getDateBoxClass = (day, presentDates) => {
    const year = selectedMonth.getFullYear();
    const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0'); // 1-based month
    const date = new Date(year, selectedMonth.getMonth(), day); // keep day as is
    const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`; // correct "YYYY-MM-DD" format
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize time
  
    let className = "";
  
    if (date.getDay() === 0) {
      className += " sunday ";
    }
  
    if (holidays.includes(dateStr)) {
      className += " holiday "; // Add holiday class if present in holidays array
    } else if (date > today) {
      className += " future ";
    } else {
      className += presentDates.includes(dateStr) ? " present " : " absent ";
    }
  
    return className.trim();
  };
  

  const handleMonthChange = (e) => {
    setSelectedMonth(new Date(e.target.value));
  };

  return (
    <div className="teacher-record-container">
      <h2>Teacher Attendance Record</h2>

      <input
        type="month"
        value={selectedMonth.toISOString().slice(0, 7)}
        onChange={handleMonthChange}
      />

      <div className="legend">
        <div>
          <div className="w-4 present"></div>
          <span className="text-xs text-gray-500">Present</span>
        </div>
        <div>
          <div className="w-4 absent"></div>
          <span className="text-xs text-gray-500">Absent</span>
        </div>
        <div>
          <div className="w-4 future"></div>
          <span className="text-xs text-gray-500">Future</span>
        </div>
        <div>
          <div className="w-4 sunday"></div>
          <span className="text-xs text-gray-500">Sunday</span>
        </div>
        <div>
          <div className="w-4 holiday"></div>
          <span className="text-xs text-gray-500">Holiday</span>
        </div>
      </div>
      <div className="record-table">
        <div className="header-row">
          <div className="name-cell">Teacher</div>
          {[...Array(getDaysInMonth()).keys()].map((_, idx) => (
            <div key={idx + 1} className="day-cell">
              {idx + 1}
            </div>
          ))}
        </div>

        {attendanceData.map((teacher, index) => (
          <div key={index} className="record-row">
            <div className="name-cell">{teacher.name}</div>
            {[...Array(getDaysInMonth()).keys()].map((_, idx) => (
              <div
                key={idx + 1}
                className={`day-cell ${getDateBoxClass(
                  idx + 1,
                  teacher.attendance
                )}`}
              >
                <span>{idx + 1}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherRecord;
