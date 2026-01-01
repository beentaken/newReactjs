import React, { useState } from "react";
import "./DatePicker.css"; // Import your CSS file for styling

const DatePickerExample = () => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleInputClick = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  return (
    <div className="datepicker-container">
      <input
        type="text"
        value={selectedDate ? selectedDate.toDateString() : ""}
        onClick={handleInputClick}
        placeholder="Select a date"
        readOnly // Make the input read-only to prevent manual text input
      />

      {isDatePickerVisible && (
        <div className="datepicker">
          {/* Your date picker UI component goes here */}
          {/* For simplicity, let's use a basic date picker */}
          <input
            type="date"
            onChange={(e) => handleDateSelect(new Date(e.target.value))}
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerExample;
