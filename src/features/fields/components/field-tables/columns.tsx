'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Field } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';
import { LOCATION_OPTIONS, SPORTS_OPTIONS } from './options';

const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export const columns: ColumnDef<Field>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Field, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama Lapangan' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Field['name']>()}</div>,
    meta: {
      label: 'Nama Lapangan',
      placeholder: 'Cari...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: ({ column }: { column: Column<Field, unknown> }) => (
      <DataTableColumnHeader column={column} title='Lokasi Cabang' />
    ),
    cell: ({ cell }) => {
      const location = cell.getValue<Field['location']>();
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
    id: 'sport',
    accessorKey: 'sport',
    header: ({ column }: { column: Column<Field, unknown> }) => (
      <DataTableColumnHeader column={column} title='Cabang Olahraga' />
    ),
    cell: ({ cell }) => {
      const sport = cell.getValue<Field['sport']>();
      return (
        <Badge variant='outline' className='capitalize'>
          {sport}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Cabang Olahraga',
      variant: 'multiSelect',
      options: SPORTS_OPTIONS
    }
  },
  {
    accessorKey: 'jamMulai',
    header: 'Jam Operasi',
    cell: ({ row }) => {
      const jamMulai = row.original.jamMulai;
      const jamTutup = row.original.jamTutup;
      return <div>{jamMulai} - {jamTutup}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];