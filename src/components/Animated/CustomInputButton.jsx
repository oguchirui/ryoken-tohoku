import React, { forwardRef } from 'react';

const CustomInputButton = forwardRef(
  ({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  )
);

export default CustomInputButton;
