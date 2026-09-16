import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parse, startOfWeek, endOfWeek } from 'date-fns';

export default function CalendarWidget({ activeDateYYYYMMDD, onSelectDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse activeDateYYYYMMDD or default to today
  const activeDate = activeDateYYYYMMDD && activeDateYYYYMMDD.length === 8 
    ? parse(activeDateYYYYMMDD, 'yyyyMMdd', new Date()) 
    : new Date();

  const [currentMonth, setCurrentMonth] = useState(activeDate);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStarts: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStarts: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDateClick = (date) => {
    const formatted = format(date, 'yyyyMMdd');
    const todayFormatted = format(new Date(), 'yyyyMMdd');
    onSelectDate(formatted === todayFormatted ? null : formatted);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-8 h-8 shrink-0 rounded transition-colors border ${isOpen ? 'bg-sports-primary text-white border-sports-primary' : 'bg-sports-bg text-sports-textMuted border-sports-border hover:text-sports-text'} ml-4`}
      >
        <CalendarIcon size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 w-64 bg-sports-surface border border-sports-border rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-1 text-sports-textMuted hover:text-sports-text hover:bg-white/5 rounded transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-sports-text">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button onClick={handleNextMonth} className="p-1 text-sports-textMuted hover:text-sports-text hover:bg-white/5 rounded transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-sports-textMuted">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isSelected = isSameDay(day, activeDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={idx}
                  onClick={() => handleDateClick(day)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-sports-primary text-white shadow-[0_0_8px_rgba(255,107,0,0.4)]'
                      : isToday
                      ? 'bg-white/10 text-sports-text'
                      : isCurrentMonth
                      ? 'text-sports-text hover:bg-white/5'
                      : 'text-sports-textMuted opacity-30 hover:bg-white/5 hover:opacity-50'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
