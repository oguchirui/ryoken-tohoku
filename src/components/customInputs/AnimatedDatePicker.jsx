import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/date-picker.css';

/**
 * AnimatedDatePicker コンポーネント
 * 日付選択のためのカスタム入力コンポーネント
 * アニメーション付きのカレンダーを表示し、選択した日付を表示する
 * 
 * @param {Date} selected - 選択された日付
 * @param {function} onChange - 日付が変更されたときに呼び出されるコールバック関数
 * @param {string} [placeholderText='日付を選んでください'] - プレースホルダーテキスト
 * @param {object} [locale=ja] - 日付のロケール設定
 * @param {string} [dropdownMode='select'] - ドロップダウンのモード ('select' または 'scroll')
 * @param {boolean} [showMonthDropdown=false] - 月のドロップダウンを表示するかどうか
 * @param {boolean} [showYearDropdown=false] - 年のドロップダウンを表示するかどうか
 * 
 * @returns {JSX.Element} - アニメーション付きの日付選択コンポーネント
 */

const AnimatedDatePicker = ({
  selected,
  onChange,
  placeholderText = '日付を選んでください',
  locale = ja,
  dropdownMode = 'select',
  showMonthDropdown = false,
  showYearDropdown = false,
}) => {
  const [open, setOpen] = useState(false); // カレンダーの開閉状態
  const [closing, setClosing] = useState(false); // カレンダーが閉じるアニメーション中かどうか
  const closeTimeoutRef = useRef(null); // 閉じるタイマーの参照

  // カレンダーを閉じるための関数
  const triggerClose = () => {
    setClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200); // アニメーションの時間に合わせる
  };

  // カレンダーを開くための関数
  const handleCalendarOpen = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpen(true);
  };

  // 日付が変更されたときのハンドラー
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
