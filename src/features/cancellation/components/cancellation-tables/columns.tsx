'use client';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

// Lazy load the cell action component - only loaded when table is rendered
const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Memuat...</div> }
);

// Function to calculate relative time
const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} detik yang lalu`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} hari yang lalu`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} tahun yang lalu`;
};

export const columns: ColumnDef<Reservation>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nama Pemesan',
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
    header: 'Tanggal Main',
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
    id: 'submittedAt',
    accessorKey: 'updated_at',
    header: 'Diajukan Pada',
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at;
      if (!updatedAt) {
        return <div className="text-gray-500">-</div>;
      }
      
      return (
        <div className="text-sm">
          <div className="font-medium text-gray-700">
            {getRelativeTime(updatedAt)}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(updatedAt).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      );
    }
  },
  {
    id: 'paymentStatus',
    accessorKey: 'paymentStatus',
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Reservation['paymentStatus']>();
      const label = status === 'waiting'
        ? 'Menunggu'
        : 'Dibatalkan'

      return (
        <Badge 
          variant='outline' 
          className={`
            capitalize 
            ${status === 'waiting' ? 'bg-yellow-300 text-black' : ''}
            ${status === 'canceled' ? 'bg-blue-300 text-black' : ''}
          `}
        >
          {label}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];