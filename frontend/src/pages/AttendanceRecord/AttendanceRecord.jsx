
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import './AttendanceRecord.css'; // ✅ Reuse the same styles
import { useUser } from '../../context/UserContext';

const AttendanceRecord = () => {
  const { classId } = useUser();
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    if (classId) fetchAttendance();
    fetchHolidays();
  }, [selectedMonth, classId]);


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
        `${BASE_URL}/api/students/monthly-attendance?classId=${classId}&year=${year}&month=${month}`,
        { withCredentials: true } // 👈 Send cookies on DELETE also
      );
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching student attendance", err);
    }
  };

  const getDaysInMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getDateBoxClass = (day, presentDates) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const date = new Date(year, month, day);
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize
    
    let className = '';
  
    if (date.getDay() === 0) {
      className += ' sunday';
    }
  
    if (holidays.includes(dateStr)) {
      className += ' holiday';
    } else if (date > today) {
      className += ' future';
    } else {
      className += presentDates.includes(dateStr) ? ' present' : ' absent';
    }
  
    return className.trim();
  };
  
  
  

  const handleMonthChange = (e) => {
    setSelectedMonth(new Date(e.target.value));
  };

  return (
    <div className="teacher-record-container">
      <h2>Student Attendance Record</h2>

      <input
        type="month"
        value={selectedMonth.toISOString().slice(0, 7)}
        onChange={handleMonthChange}
      />

      <div className="legend">
        <div><div className="w-4 present"></div><span className="text-xs text-gray-500">Present</span></div>
        <div><div className="w-4 absent"></div><span className="text-xs text-gray-500">Absent</span></div>
        <div><div className="w-4 future"></div><span className="text-xs text-gray-500">Future</span></div>
        <div><div className="w-4 sunday"></div><span className="text-xs text-gray-500">Sunday</span></div>
        <div><div className="w-4 holiday"></div><span className="text-xs text-gray-500">Holiday</span></div>

      </div>

      <div className="record-table">
        <div className="header-row">
          <div className="name-cell">Student</div>
          {[...Array(getDaysInMonth()).keys()].map((_, idx) => (
            <div key={idx + 1} className="day-cell">{idx + 1}</div>
          ))}
        </div>

        {attendanceData.map((student, index) => (
          <div key={index} className="record-row">
            <div className="name-cell">{student.name}</div>
            {[...Array(getDaysInMonth()).keys()].map((_, idx) => (
              <div
                key={idx + 1}
                className={`day-cell ${getDateBoxClass(idx + 1, student.attendance)}`}
              >{idx + 1}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceRecord;


