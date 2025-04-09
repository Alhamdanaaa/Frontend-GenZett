'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Admin } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { ACCOUNT_STATUS_OPTIONS, LOCATION_OPTIONS } from './options';

export const columns: ColumnDef<Admin>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Admin, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama Admin' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Admin['name']>()}</div>,
    meta: {
      label: 'Nama',
      placeholder: 'Cari admin...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'phone',
    header: 'Nomor Telepon',
    cell: ({ cell }) => {
      const phone = cell.getValue<Admin['phone']>();
      return <div>{phone}</div>;
    }
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: ({ column }: { column: Column<Admin, unknown> }) => (
      <DataTableColumnHeader column={column} title='Lokasi' />
    ),
    cell: ({ cell }) => {
      const location = cell.getValue<Admin['location']>();
      return <div>{location}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Lokasi',
      variant: 'multiSelect',
      options: LOCATION_OPTIONS
    }
  },
  {
    id: 'accountStatus',
    accessorKey: 'accountStatus',
    header: ({ column }: { column: Column<Admin, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status Akun' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Admin['accountStatus']>();
      return (
        <Badge
          variant='outline'
          className={`capitalize ${status === 'Active' ? 'bg-green-300 text-black' : ''} ${status === 'Inactive' ? 'bg-gray-300 text-black' : ''} ${status === 'Suspended' ? 'bg-red-300 text-black' : ''} `}
        >
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status Akun',
      variant: 'multiSelect',
      options: ACCOUNT_STATUS_OPTIONS
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
