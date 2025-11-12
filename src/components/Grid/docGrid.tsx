import React from "react";

const CustomCellRenderer = ({ value, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer" }}>
      {value}
    </div>
  );
};

export default CustomCellRenderer;
