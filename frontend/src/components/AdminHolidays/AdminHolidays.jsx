
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./AdminHolidays.css";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AdminHolidays = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Track viewed month


  const formatDateLocal = (date) => {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().split("T")[0];
  };

  // Fetch holidays for currently viewed month
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth(); // 0-indexed
        const res = await axios.get(`${BASE_URL}/api/holidays/month?year=${year}&month=${month}`, {
          withCredentials: true,
        });
        setSelectedDates(res.data || []);
      } catch (err) {
        console.error("Failed to fetch holidays", err);
      }
    };

    fetchHolidays();
  }, [currentMonth]);

  const onDateClick = (date) => {
    const dateStr = formatDateLocal(date); // use local-corrected date
    setSelectedDates((prevDates) =>
      prevDates.includes(dateStr)
        ? prevDates.filter((d) => d !== dateStr)
        : [...prevDates, dateStr]
    );
  };

    const handleSubmit = async () => {
    try {
      const datesToSubmit = [...selectedDates]; // Ensure immutability
      await axios.post(
        `${BASE_URL}/api/holidays/set`,
        { dates: datesToSubmit },
        { withCredentials: true }
      );
      alert("Holidays saved successfully!");
    } catch (error) {
      console.error("Error saving holidays:", error);
      alert("Failed to save holidays.");
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = formatDateLocal(date); // again, local-corrected
      return selectedDates.includes(dateStr) ? "selected-holiday" : null;
    }
    return null;
  };

  return (
    <div className="admin-holidays-container">
      <h2 className="holiday-title">Select Holidays</h2>
      <Calendar
        onClickDay={onDateClick}
        tileClassName={tileClassName}
        onActiveStartDateChange={({ activeStartDate }) =>
          setCurrentMonth(activeStartDate)
        }
      />
      <div className="selected-dates">
        <h4>Selected Dates:</h4>
        {selectedDates.length === 0 ? (
          <p>None</p>
        ) : (
          <ul>
            {selectedDates.sort().map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        )}
      </div>
      <button className="submit-holiday-btn" onClick={handleSubmit}>
        Save Holidays
      </button>
    </div>
  );
};

export default AdminHolidays;


