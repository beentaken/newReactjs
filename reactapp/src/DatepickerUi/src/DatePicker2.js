import React, { useState } from "react";
import "./DatePicker.css"; // You can create your own CSS file for styling

const DatePicker2 = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const totalDays = daysInMonth(year, month);
    const firstDay = startOfMonth(year, month);

    const calendarDays = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push("");
        } else if (dayCounter <= totalDays) {
          week.push(dayCounter);
          dayCounter++;
        }
      }
      calendarDays.push(week);
    }

    return calendarDays;
  };

  const handleDateClick = (day) => {
    const currentDate = new Date();
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedDate);
    setShowCalendar(false);
  };

  return (
    <div className="date-picker">
      <input
        type="text"
        value={selectedDate ? selectedDate.toDateString() : ""}
        onClick={() => setShowCalendar(!showCalendar)}
        readOnly
      />
      {showCalendar && (
        <div className="calendar">
          {generateCalendar().map((week, weekIndex) => (
            <div key={weekIndex} className="week">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`day ${day === "" ? "empty" : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatePicker2;
