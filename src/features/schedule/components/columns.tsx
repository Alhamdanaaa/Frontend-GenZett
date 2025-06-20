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
  paymentStatus: 'pending' | 'complete' | 'dp' | 'closed';
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
    header: () => <div className="w-[80px] font-semibold">Waktu</div>,
    cell: ({ cell }) => (
      <div className="w-[80px] overflow-hidden truncate font-medium text-center py-2">
        {cell.getValue() as string}
      </div>
    ),
    meta: { label: 'Waktu' },
  };

  const fieldColumns: ColumnDef<ScheduleRow>[] = fieldNames.map((fieldName) => {
    const accessorKey = fieldName.replace(/\s+/g, '_');

    return {
      accessorKey,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={fieldName} />
      ),
      cell: ({ cell }) => (
        <div className="min-w-[120px] text-center py-1">
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
  const field = fields.find(f => f.name === fieldName);
  if (!field) return [];

  const bookedTimes = schedules
    .filter(s => s.fieldName === fieldName && s.date === selectedDate)
    .map(s => s.fieldTime);

  return field.times.filter(time => !bookedTimes.includes(time));
}

export function generateTableData(
  schedules: Schedule[], 
  fields: Field[],
  fieldNames: string[], 
  selectedDate: string
): ScheduleRow[] {
  // Get all unique time slots from selected fields only
  const relevantFields = fields.filter(f => fieldNames.includes(f.name));
  const allTimes = Array.from(
    new Set(relevantFields.flatMap(f => f.times || []))
  ).sort();

  if (allTimes.length === 0) {
    return [];
  }

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
      const isTimeAvailable = field?.times?.includes(time) || false;

      if (booking) {
        const statusConfig = {
          complete: { bg: 'bg-green-500', text: 'text-white', label: 'Lunas' },
          pending: { bg: 'bg-yellow-500', text: 'text-white', label: 'Pending' },
          dp: { bg: 'bg-blue-500', text: 'text-white', label: 'DP' },
          closed: { bg: 'bg-gray-500', text: 'text-white', label: 'Tutup' }
        };

        const config = statusConfig[booking.paymentStatus] || statusConfig.closed;
        
        row[key] = (
          <div className={`rounded-md px-2 py-1 text-xs font-medium ${config.bg} ${config.text} shadow-sm`}>
            <div className="truncate" title={booking.name}>
              {booking.name}
            </div>
            <div className="text-xs opacity-75">
              {config.label}
            </div>
          </div>
        );
      } else if (isTimeAvailable) {
        row[key] = (
          <div className="text-green-600 text-xs font-medium bg-green-50 rounded-md px-2 py-1 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
            <div>Tersedia</div>
          </div>
        );
      } else {
        row[key] = (
          <div className="text-gray-400 text-xs py-1">
            <div className="w-full h-6 bg-gray-50 rounded-md flex items-center justify-center">
              -
            </div>
          </div>
        );
      }
    });

    return row;
  });
}

// Helper function to get field names for a specific sport
export function getFieldNamesForSport(
  fields: Field[],
  schedules: Schedule[],
  sportId: string,
  locationId?: number
): string[] {
  if (sportId === 'all') {
    return fields.map(f => f.name);
  }
  return fields.map(f => f.name);
}

export function filterSchedules(
  schedules: Schedule[],
  date: string,
  sportId: string,
  locationId?: number
): Schedule[] {
  return schedules.filter(schedule => {
    const matchesDate = !date || schedule.date === date;
    const matchesSport = sportId === 'all' || String(schedule.sport) === String(sportId);
    const matchesLocation = !locationId || schedule.locationId === locationId;
    
    return matchesDate && matchesSport && matchesLocation;
  });
}