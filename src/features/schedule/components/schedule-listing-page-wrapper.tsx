'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import ScheduleFilter from '@/features/schedule/components/schedule-filter';

// Lazy load the heavy component
const ScheduleListingPage = dynamic(
  () => import('@/features/schedule/components/schedule-listing-page'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Memuat jadwal...</p>
        </div>
      </div>
    )
  }
);

export default function ScheduleListingPageWrapper() {
  // Use current date as default instead of hardcoded date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState('1'); // Default to Futsal ID (assuming Futsal has ID 1)
  // Ubah data location Id berdasarkan admin
  const [selectedLocation, setSelectedLocation] = useState<number | undefined>(undefined);

  return (
    <div className='space-y-4'>
      <div className="flex flex-col space-y-4">
        
        <ScheduleFilter
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
        />
        
        {/* Optional: Add location filter if you have multiple locations */}
        {/* 
        <LocationFilter 
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
        */}
      </div>

      <ScheduleListingPage 
        selectedDate={selectedDate}
        selectedSport={selectedSport}
        locationId={1}
      />
    </div>
  );
}