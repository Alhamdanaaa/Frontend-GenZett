'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { User } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';

const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),

    cell: ({ cell }) => <div>{cell.getValue<User['name']>()}</div>,
    meta: {
      label: 'Nama',
      placeholder: 'Cari...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ cell }) => {
      const email = cell.getValue<User['email']>();
      return <div>{email}</div>;
    }
  },
  {
    accessorKey: 'phone',
    header: 'Nomor Telepon',
    cell: ({ cell }) => {
      const phone = cell.getValue<User['phone']>();
      return <div>{phone}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];