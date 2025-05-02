'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import ScheduleFilter from '@/features/schedule/components/schedule-filter';

// Lazy load the heavy component
const ScheduleListingPage = dynamic(
  () => import('@/features/schedule/components/schedule-listing-page'),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full flex items-center justify-center">Loading schedule data...</div>
  }
);

export default function ScheduleListingPageWrapper() {
  const [selectedDate, setSelectedDate] = useState(new Date('2024-05-27'));
  const [selectedSport, setSelectedSport] = useState('Futsal');
  
  return (
    <div className='space-y-4'>
      <ScheduleFilter
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
      />
      <ScheduleListingPage 
        selectedDate={selectedDate}
        selectedSport={selectedSport}
      />
    </div>
  );
}