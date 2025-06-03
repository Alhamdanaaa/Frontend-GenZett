import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import React from 'react';

export type Schedule = {
  locationId: number;
  name: string;
  date: string;
  fieldTime: string;
  fieldName: string;
  sport: string;
  paymentStatus: 'pending' | 'complete' | 'dp'| 'closed' ;
};

export type Field = {
  fieldId: number;
  name: string;
  times: string[];
};

export type ScheduleRow = {
  time: string;
  [fieldName: string]: React.ReactNode;
};

export function generateColumns(fieldNames: string[]): ColumnDef<ScheduleRow>[] {
  const timeColumn: ColumnDef<ScheduleRow> = {
    accessorKey: 'time',
    header: () => <div className="w-[80px]">Waktu</div>,
    cell: ({ cell }) => (
      <div className="w-[80px] overflow-hidden truncate">
        {cell.getValue() as string}
      </div>
    ),
    meta: { label: 'Waktu' },
  };

  const fieldColumns: ColumnDef<ScheduleRow>[] = fieldNames.map((fieldName) => {
    const accessorKey = fieldName.replace(/\s+/g, '_'); // "Lapangan Futsal 1" => "Lapangan_Futsal_1"

    return {
      accessorKey,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={fieldName} />
      ),
      cell: ({ cell }) => (
        <div className="min-w-[100px] text-center">
          {cell.getValue() as React.ReactNode}
        </div>
      ),
      meta: { label: fieldName },
    };
  });

  return [timeColumn, ...fieldColumns];
}

// Generate available time slots for a specific field and date
export function getAvailableTimesForField(
  fields: Field[], 
  fieldName: string, 
  schedules: Schedule[], 
  selectedDate: string
): string[] {
  // Find the field configuration
  const field = fields.find(f => f.name === fieldName);
  if (!field) return [];

  // Get booked times for this field on the selected date
  const bookedTimes = schedules
    .filter(s => s.fieldName === fieldName && s.date === selectedDate)
    .map(s => s.fieldTime);

  // Return only available times (not booked)
  return field.times.filter(time => !bookedTimes.includes(time));
}

// Enhanced table data generation with availability information
export function generateTableData(
  schedules: Schedule[], 
  fields: Field[],
  fieldNames: string[], 
  selectedDate: string
): ScheduleRow[] {
  // Get all unique time slots from all fields
  const allTimes = Array.from(
    new Set(fields.flatMap(f => f.times))
  ).sort();

  return allTimes.map((time) => {
    const row: ScheduleRow = { time };

    fieldNames.forEach((fieldName) => {
      const key = fieldName.replace(/\s+/g, '_');
      
      // Check if there's a booking for this time and field
      const booking = schedules.find(
        (s) => s.fieldTime === time && s.fieldName === fieldName && s.date === selectedDate
      );

      // Check if this time slot is available for this field
      const field = fields.find(f => f.name === fieldName);
      const isTimeAvailable = field?.times.includes(time) || false;

      if (booking) {
        // Show booking information
        row[key] = (
          <div className={`rounded px-2 py-1 text-xs text-white font-medium ${
            booking.paymentStatus === 'complete' ? 'bg-green-500'
            : booking.paymentStatus === 'pending' ? 'bg-yellow-500'
            : booking.paymentStatus === 'dp' ? 'bg-blue-500'
            : 'bg-gray-500'
          }`}>
            {booking.name}
          </div>
        );
      } else if (isTimeAvailable) {
        // Show available slot
        row[key] = (
          <div 
          className="text-green-600 text-xs font-medium bg-green-50 rounded px-2 py-1 border border-green-200">
            Tersedia
          </div>
        );
      } else {
        // Time slot not available for this field
        row[key] = (
          <div className="text-gray-400 text-xs">-</div>
        );
      }
    });

    return row;
  });
}