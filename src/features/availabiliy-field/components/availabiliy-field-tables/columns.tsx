'use client';
import { Reservation } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';

// Lazy load the cell action component - only loaded when table is rendered
const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export const columns: ColumnDef<Reservation>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Detail Penutupan',
    cell: ({ cell }) => <div>{cell.getValue<Reservation['name']>()}</div>,
    meta: {
      label: 'Nama',
      placeholder: 'Cari...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'fieldData',
    header: 'Lapangan & Waktu',
    cell: ({ row }) => {
      const fieldData = row.original.fieldData ?? [];
      return (
        <div className="max-w-[250px]">
          {fieldData.map((field, index) => (
            <div key={index} className="mb-1">
              <div className="font-medium">{field.fieldName}</div>
              <div className="text-sm text-gray-600">
                {field.times.map((time) => time).join(', ')}
              </div>
            </div>
          ))}
        </div>
      );
    }
  },
  {
    id: 'date',
    accessorKey: 'fieldData',
    header: 'Tanggal Ditutup',
    cell: ({ row }) => {
      const fieldData = row.original.fieldData || [];
      return (
        <div>
          {fieldData.map((field, index) => (
            <div key={index} className="mb-1">
              {field.dates.join(', ')}
            </div>
          ))}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Tanggal Main',
      variant: 'date'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];