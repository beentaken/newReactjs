import React, { useState } from "react";

const DatePicker = () => {
  // State to store the selected date
  const [selectedDate, setSelectedDate] = useState(null);

  // Function to handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Function to generate an array of days in a month
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  };

  // Function to get the first day of the month
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Function to get the current date
  const getCurrentDate = () => new Date();

  // Current year and month
  const currentYear = getCurrentDate().getFullYear();
  const currentMonth = getCurrentDate().getMonth();

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate an array of days in the current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // Get the first day of the current month
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  return (
    <div>
      <h2>
        {monthNames[currentMonth]} {currentYear}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {daysInMonth.map((day, index) =>
            index % 7 === 0 ? (
              <tr key={index}>
                {Array.from({ length: 7 }, (_, i) => i).map((d) => {
                  const dayNumber = index - firstDayOfMonth + d + 1;
                  const isCurrentMonth =
                    dayNumber > 0 && dayNumber <= daysInMonth.length;
                  const date = isCurrentMonth
                    ? new Date(currentYear, currentMonth, dayNumber)
                    : null;

                  return (
                    <td
                      key={d}
                      onClick={() => isCurrentMonth && handleDateSelect(date)}
                      className={isCurrentMonth ? "active" : "inactive"}
                    >
                      {isCurrentMonth ? dayNumber : ""}
                    </td>
                  );
                })}
              </tr>
            ) : null
          )}
        </tbody>
      </table>
      <div>
        Selected Date: {selectedDate ? selectedDate.toDateString() : "None"}
      </div>
    </div>
  );
};

export default DatePicker;
