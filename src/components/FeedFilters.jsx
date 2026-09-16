import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDateToYYYYMMDD } from '../utils/dateHelpers';

export const SPORT_CATEGORIES = [
  { id: 'soccer/all', name: 'Football', icon: '⚽' },
  { id: 'basketball/nba', name: 'Basketball', icon: '🏀' },
  { id: 'football/nfl', name: 'American Football', icon: '🏈' },
  { id: 'baseball/mlb', name: 'Baseball', icon: '⚾' },
];

export default function FeedFilters({ 
  selectedDate, 
  onSelectDate,
  sportCategory,
  onSelectSport
}) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dates = [
    { label: 'Yesterday', value: formatDateToYYYYMMDD(yesterday) },
    { label: 'Today', value: formatDateToYYYYMMDD(today) },
    { label: 'Tomorrow', value: formatDateToYYYYMMDD(tomorrow) },
  ];

  // If no date is selected, it defaults to today's date in Landing, but here we can just match it
  const activeDate = selectedDate || formatDateToYYYYMMDD(today);

  return (
    <div className="bg-sports-surface border-y border-sports-border mb-4 sticky top-16 z-40 shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-sports-textMuted mr-1" />
          <div className="flex bg-sports-bg rounded-lg p-1 border border-sports-border">
            {dates.map((d) => {
              const isSelected = activeDate === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => onSelectDate(d.value === formatDateToYYYYMMDD(today) ? null : d.value)}
                  className={`px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                    isSelected 
                      ? 'bg-sports-primary text-white shadow-sm' 
                      : 'text-sports-textMuted hover:text-sports-text'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sport Filter */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
          <div className="flex bg-sports-bg rounded-lg p-1 border border-sports-border min-w-max">
            {SPORT_CATEGORIES.map((sport) => {
              const isSelected = sportCategory === sport.id;
              return (
                <button
                  key={sport.id}
                  onClick={() => onSelectSport(sport.id)}
                  className={`px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-sports-surface border border-sports-border text-sports-primary shadow-sm' 
                      : 'text-sports-textMuted hover:text-sports-text border border-transparent'
                  }`}
                >
                  <span>{sport.icon}</span> <span className="whitespace-nowrap">{sport.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
