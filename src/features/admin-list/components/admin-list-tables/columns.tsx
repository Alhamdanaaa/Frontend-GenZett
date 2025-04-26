'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Admin } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { LOCATION_OPTIONS } from './options';

export const columns: ColumnDef<Admin>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Admin, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama Admin' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Admin['name']>()}</div>,
    meta: {
      label: 'Nama Admin',
      placeholder: 'Cari...',
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
      <DataTableColumnHeader column={column} title='Lokasi Cabang' />
    ),
    cell: ({ cell }) => {
      const location = cell.getValue<Admin['location']>();
      return <div>{location}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Lokasi Cabang',
      variant: 'multiSelect',
      options: LOCATION_OPTIONS
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
