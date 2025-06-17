import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/date-picker.css';

const AnimatedDatePicker = ({
  selected,
  onChange,
  placeholderText = '日付を選んでください',
  locale = ja,
  dropdownMode = 'select',
  showMonthDropdown = false,
  showYearDropdown = false,
}) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimeoutRef = useRef(null);

  const triggerClose = () => {
    setClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200); // アニメーション時間と一致
  };

  const handleCalendarOpen = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpen(true);
  };

  const handleChange = (newDate) => {
    if (onChange) {
      onChange(newDate);
    }
    triggerClose();
  };

  return (
    <DatePicker
      selected={selected}
      onChange={handleChange}
      onCalendarOpen={handleCalendarOpen}
      open={open}
      onClickOutside={triggerClose}
      onSelect={triggerClose}
      locale={locale}
      showMonthDropdown={showMonthDropdown}
      showYearDropdown={showYearDropdown}
      dropdownMode={dropdownMode}
      calendarContainer={({ children }) => (
        <div className={`calendar-animate ${closing ? 'fade-out' : 'fade-in'}`}>
          {children}
        </div>
      )}
      customInput={
        <button
          className="custom-input-button"
          type="button"
          onClick={() => {
            if (open) {
              triggerClose();
            } else {
              handleCalendarOpen();
            }
          }}
        >
          {selected ? format(new Date(selected), 'yyyy年MM月dd日') : placeholderText}
        </button>
      }
    />
  );
};

export default AnimatedDatePicker;
