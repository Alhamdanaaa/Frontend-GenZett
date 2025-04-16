'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Member } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { DAY_OPTIONS } from './options';

export const columns: ColumnDef<Member>[] = [
  {
    id: 'username',
    accessorKey: 'username',
    header: ({ column }: { column: Column<Member, unknown> }) => (
      <DataTableColumnHeader column={column} title='Username' />
    ),
    cell: ({ cell }) => {
      const username = cell.getValue<Member['username']>();
      return <div>{username}</div>;
    },
    meta: {
      label: 'Username',
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Member, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Member['name']>()}</div>,
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
      const email = cell.getValue<Member['email']>();
      return <div>{email}</div>;
    }
  },
  {
    accessorKey: 'phone',
    header: 'Nomor Telepon',
    cell: ({ cell }) => {
      const phone = cell.getValue<Member['phone']>();
      return <div>{phone}</div>;
    }
  },
  {
    id: 'day',
    accessorKey: 'day',
    header: ({ column }: { column: Column<Member, unknown> }) => (
      <DataTableColumnHeader column={column} title='Hari Main' />
    ),
    cell: ({ cell }) => {
      const day = cell.getValue<Member['day']>();
      return <div>{day}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Hari Main',
      variant: 'multiSelect',
      options: DAY_OPTIONS
    }
  },
  {
    accessorKey: 'create_at',
    header: 'Tanggal Member',
    cell: ({ cell }) => {
      const createDate = cell.getValue<Member['create_at']>();
      return <div>{createDate}</div>;
    }
  },
  {
    accessorKey: 'validUntil',
    header: 'Valid Hingga',
    cell: ({ cell }) => {
      const validUntil = cell.getValue<Member['validUntil']>();
      return <div>{validUntil}</div>;
    }
  },
  {
    accessorKey: 'fieldTime',
    header: 'Lapangan & Jam',
    cell: ({ cell }) => {
      const fieldTime = cell.getValue<Member['fieldTime']>();
      return <div className='max-w-[250px] truncate'>{fieldTime}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];