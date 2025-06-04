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

const PopoverWithCalendar = dynamic(
  () => import('./popover-with-calendar'),
  { ssr: false }
);

type SportOption = {
  label: string;
  value: string;
};

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
  const [sportOptions, setSportOptions] = useState<SportOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const sportData = await getAllSports();
        
        if (Array.isArray(sportData) && sportData.length > 0) {
          const options = sportData.map((sport: any) => ({
            label: sport.name || sport.sportName || 'Unknown Sport',
            value: String(sport.id || sport.sportId),
          }));
          setSportOptions(options);
        } else {
          // Fallback jika API tidak mengembalikan data
          console.warn('No sports data received, using fallback options');
          setSportOptions([
            { label: 'Futsal', value: '1' },
            { label: 'Badminton', value: '2' },
            { label: 'Basketball', value: '3' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching sports:', error);
        setError('Gagal memuat data olahraga');
        
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

  const getCurrentSportName = () => {
    if (selectedSport === 'all') return 'Semua Olahraga';
    const sport = sportOptions.find(s => s.value === selectedSport);
    return sport?.label || 'Olahraga Tidak Dikenal';
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-end gap-4'>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tanggal <span className="text-red-500">*</span>
          </label>
          <PopoverWithCalendar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Olahraga <span className="text-red-500">*</span>
          </label>
          <Select 
            onValueChange={setSelectedSport} 
            value={selectedSport}
            disabled={isLoading}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder={
                isLoading ? 'Memuat...' : 
                error ? 'Error memuat data' : 
                'Pilih Olahraga'
              } />
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
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>

        {/* Quick date selectors */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Quick Select</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-2 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              Hari Ini
            </button>
            <button
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setSelectedDate(tomorrow);
              }}
              className="px-3 py-2 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              Besok
            </button>
          </div>
        </div>
      </div>

      {/* Current selection display */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Filter Aktif:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Tanggal: </span>
            <span className="font-medium text-gray-900">
              {selectedDate.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Olahraga: </span>
            <span className="font-medium text-gray-900">
              {getCurrentSportName()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}