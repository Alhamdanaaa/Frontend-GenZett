import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import React from 'react';
import { Schedule } from '@/constants/data';

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
    const accessorKey = fieldName.replace(/\s+/g, '_'); // "Lapangan 2" => "Lapangan_2"

    return {
      accessorKey,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={fieldName} />
      ),
      cell: ({ cell }) => <div className="min-w-[100px] text-center">{cell.getValue() as React.ReactNode}</div>,
      meta: { label: fieldName },
    };
  });

  return [timeColumn, ...fieldColumns];
}

// Optimized table data generation
export function generateTableData(
  schedules: Schedule[], 
  fieldNames: string[], 
  // operatingHours: string[]
): ScheduleRow[] {
  const operatingHours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  return operatingHours.map((hour) => {
    const row: ScheduleRow = { time: hour };

    fieldNames.forEach((fieldName) => {
      const key = fieldName.replace(/\s+/g, '_');
      const match = schedules.find(
        (s) => s.fieldTime === hour && s.fieldName === fieldName
      );

      if (match) {
        row[key] = (
          <div className={`rounded px-2 py-1 text-xs text-white ${
            match.paymentStatus === 'complete' ? 'bg-green-500'
            : match.paymentStatus === 'pending' ? 'bg-yellow-500'
            : match.paymentStatus === 'dp' ? 'bg-blue-500'
            : 'bg-gray-500'}`}>
            {match.name}
          </div>
        );
      } else {
        row[key] = (
          <div className="text-gray-400">-</div>
        );
      }
    });

    return row;
  });
}