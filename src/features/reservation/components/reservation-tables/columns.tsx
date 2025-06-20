'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Reservation } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PAYMENT_STATUS_OPTIONS } from './options';

// Lazy load the cell action component - only loaded when table is rendered
const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Memuat...</div> }
);

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
    accessorKey: 'remainingPayment',
    header: 'Sisa Pembayaran',
    cell: ({ cell }) => {
      const remainingPayment = cell.getValue<Reservation['remainingPayment']>();
      return <div>Rp {remainingPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</div>;
    }
  },
  {
    id: 'paymentStatus',
    accessorKey: 'paymentStatus',
    header: ({ column }: { column: Column<Reservation, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status Pembayaran' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Reservation['paymentStatus']>();
      const label = status === 'pending'
        ? 'Menunggu'
        : status === 'dp'
        ? 'Uang Muka'
        : status === 'complete'
        ? 'Lunas'
        : status === 'fail'
        ? 'Gagal'
        : status;
      return (
        <Badge 
          variant='outline' 
          className={`
            capitalize 
            ${status === 'pending' ? 'bg-yellow-300 text-black' : ''}
            ${status === 'dp' ? 'bg-blue-300 text-black' : ''}
            ${status === 'complete' ? 'bg-green-300 text-black' : ''}
            ${status === 'fail' ? 'bg-red-300 text-black' : ''}
          `}
        >
          {label}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status Pembayaran',
      variant: 'select',
      options: PAYMENT_STATUS_OPTIONS
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];