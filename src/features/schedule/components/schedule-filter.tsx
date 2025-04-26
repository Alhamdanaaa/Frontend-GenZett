'use client';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SPORT_OPTIONS } from './option';
import { format } from 'date-fns';

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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='w-[200px] justify-start text-left font-normal'
          >
            {selectedDate ? format(selectedDate, 'PPP') : 'Pilih tanggal'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0'>
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
