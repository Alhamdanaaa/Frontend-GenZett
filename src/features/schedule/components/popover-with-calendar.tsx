'use client';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';


type PopoverWithCalendarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export default function PopoverWithCalendar({
  selectedDate,
  setSelectedDate
}: PopoverWithCalendarProps) {
  return (
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
  );
}