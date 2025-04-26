'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Reservation } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { PAYMENT_STATUS_OPTIONS, RESERVATION_STATUS_OPTIONS } from './options';

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
    accessorKey: 'fieldTime',
    header: 'Lapangan & Waktu',
    cell: ({ cell }) => {
      const fieldTime = cell.getValue<Reservation['fieldTime']>();
      return <div className='max-w-[250px] truncate'>{fieldTime}</div>;
    }
  },
  {
    accessorKey: 'date',
    header: 'Tanggal Main',
    cell: ({ cell }) => {
      const date = cell.getValue<Reservation['date']>();
      return <div>{date}</div>;
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
        : status === 'down payment'
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
            ${status === 'down payment' ? 'bg-blue-300 text-black' : ''}
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
      variant: 'multiSelect',
      options: PAYMENT_STATUS_OPTIONS
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];