'use client';
import dynamic from 'next/dynamic';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SPORT_OPTIONS } from './option';

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
  return (
    <div className='mb-4 flex flex-wrap items-center gap-4'>
      <PopoverWithCalendar 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <Select onValueChange={setSelectedSport} defaultValue={selectedSport}>
        <SelectTrigger className='w-[200px]'>
          <SelectValue placeholder='Pilih Olahraga' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Semua</SelectItem>
          {SPORT_OPTIONS.map((sport) => (
            <SelectItem key={sport.value} value={sport.value}>
              {sport.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}