import Holiday from "../models/Holiday.js";

// Save/update list of holidays
export const setHolidays = async (req, res) => {
  try {
    const { dates } = req.body;

    if (!Array.isArray(dates)) {
      return res.status(400).json({ message: "Invalid date list." });
    }

    // Group dates by month
    const monthMap = {};
    dates.forEach((dateStr) => {
      const month = dateStr.slice(0, 7); // "YYYY-MM"
      if (!monthMap[month]) {
        monthMap[month] = [];
      }
      monthMap[month].push(dateStr);
    });

    // Upsert each month with its holiday dates
    const upsertPromises = Object.entries(monthMap).map(
      async ([month, monthDates]) => {
        await Holiday.findOneAndUpdate(
          { month },
          { $set: { dates: monthDates } },
          { upsert: true, new: true }
        );
      }
    );

    await Promise.all(upsertPromises);

    res.status(200).json({ message: "Holidays saved successfully." });
  } catch (error) {
    console.error("Error saving holidays:", error);
    res.status(500).json({ message: "Failed to save holidays." });
  }
};

// Get all holidays
export const getHolidays = async (req, res) => {
  try {
    const allHolidays = await Holiday.find({});
    const holidayDates = allHolidays.flatMap((doc) => doc.dates);

    res.status(200).json({ holidays: holidayDates });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ message: "Failed to fetch holidays." });
  }
};

// Get holidays by year and month
export const getMonthlyHolidays = async (req, res) => {
  try {
    let { year, month } = req.query;

    if (!year || month === undefined) {
      return res.status(400).json({ error: "Year and month are required." });
    }

    const monthNumber = parseInt(month) + 1;
    const formattedMonth = String(monthNumber).padStart(2, "0");
    const monthString = `${year}-${formattedMonth}`; // e.g., "2025-03"

    const record = await Holiday.findOne({ month: monthString });

    res.json(record?.dates || []);
  } catch (error) {
    console.error("Error fetching monthly holidays:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
