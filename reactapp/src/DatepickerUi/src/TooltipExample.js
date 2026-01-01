import React, { useState } from "react";
import "./Tooltip.css"; // Import your CSS file for styling

const TooltipExample = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleButtonClick = () => {
    // Handle button click event here
    alert("Button Clicked!");
  };

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div className="tooltip-container">
      <button
        className="tooltip-button"
        onClick={handleButtonClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Hover me
      </button>

      {isTooltipVisible && (
        <div className="tooltip">
          <p>Tooltip Content Here</p>
        </div>
      )}
    </div>
  );
};

export default TooltipExample;
