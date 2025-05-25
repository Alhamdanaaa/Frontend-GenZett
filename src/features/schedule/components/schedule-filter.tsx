'use client';
import dynamic from 'next/dynamic';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getAllSports } from '@/lib/api/sports';
import { useEffect, useState } from 'react';

// Dynamically import the Calendar component
const PopoverWithCalendar = dynamic(
  () => import('./popover-with-calendar'),
  { ssr: false }
);

type ScheduleFilterProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
};

export default function ScheduleFilter({
  selectedDate,
  setSelectedDate,
  selectedSport,
  setSelectedSport
}: ScheduleFilterProps) {
  const [sportOptions, setSportOptions] = useState<Array<{label: string, value: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true);
        const sportData = await getAllSports();
        const options = sportData.map((sport: any) => ({
          label: sport.name,
          value: String(sport.id),
        }));
        setSportOptions(options);
      } catch (error) {
        console.error('Error fetching sports:', error);
        // Fallback sport options
        setSportOptions([
          { label: 'Futsal', value: '1' },
          { label: 'Badminton', value: '2' },
          { label: 'Basketball', value: '3' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  return (
    <div className='mb-4 flex flex-wrap items-center gap-4'>
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Tanggal</label>
        <PopoverWithCalendar 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Olahraga</label>
        <Select 
          onValueChange={setSelectedSport} 
          value={selectedSport}
          disabled={isLoading}
        >
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder={isLoading ? 'Loading...' : 'Pilih Olahraga'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Semua Olahraga</SelectItem>
            {sportOptions.map((sport) => (
              <SelectItem key={sport.value} value={sport.value}>
                {sport.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display current selection info */}
      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
        <p>
          <span className="font-medium">Menampilkan:</span>{' '}
          {sportOptions.find(s => s.value === selectedSport)?.label || 'Semua Olahraga'}{' '}
          pada {selectedDate.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
}