export function generateWeekDays() {
  const days = [];
  const today = new Date();
  
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export function formatDateToYYYYMMDD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function formatDayDisplay(date) {
  const today = new Date();
  
  const resetTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  
  const timeDate = resetTime(date);
  const timeToday = resetTime(today);
  
  if (timeDate === timeToday) return 'TODAY';
  if (timeDate === timeToday + 86400000) return 'TOMORROW';
  if (timeDate === timeToday - 86400000) return 'YESTERDAY';
  
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNum = date.getDate();
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  return `${dayName} ${dayNum} ${monthName}`.toUpperCase();
}
