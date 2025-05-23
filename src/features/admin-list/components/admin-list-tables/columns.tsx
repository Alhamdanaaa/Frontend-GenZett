'use client';

import { AdminOutput as Admin } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';

const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export function getColumns(
  locationOptions: { label: string; value: string }[]
): ColumnDef<Admin>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Nama Admin',
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
      id: 'email',
      accessorKey: 'email',
      header: 'Email',
      cell: ({ cell }) => <div>{cell.getValue<Admin['email']>()}</div>,
      enableColumnFilter: true,
      meta: {
        label: 'Email'
      }
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
      header: 'Lokasi Cabang',
      cell: ({ cell }) => {
        const location = cell.getValue<Admin['location']>();
        return <div>{location}</div>;
      },
      enableColumnFilter: true,
      meta: {
        label: 'Lokasi Cabang',
        variant: 'multiSelect',
        options: locationOptions 
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];
}