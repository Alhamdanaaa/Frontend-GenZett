'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { User } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { MEMBER_STATUS_OPTIONS } from './options';

export const columns: ColumnDef<User>[] = [
  {
    id: 'username',
    accessorKey: 'username',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Username' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<User['username']>()}</div>,
    meta: {
      label: 'Username',
      placeholder: 'Cari username...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'name',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: ({ cell }) => {
      const name = cell.getValue<User['name']>();
      return <div>{name}</div>;
    }
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
    id: 'memberStatus',
    accessorKey: 'memberStatus',
    header: ({ column }: { column: Column<User, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status Member' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<User['memberStatus']>();
      return (
        <Badge 
          variant='outline' 
          className={`
            capitalize 
            ${status === 'Member' ? 'bg-yellow-300 text-black' : ''}
            ${status === 'Non-Member' ? 'bg-gray-800' : ''}
          `}
        >
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status Member',
      variant: 'multiSelect',
      options: MEMBER_STATUS_OPTIONS
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];