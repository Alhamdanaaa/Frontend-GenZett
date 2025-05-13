'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Membership } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Image from 'next/image';
import { LOCATION_OPTIONS, SPORTS_OPTIONS } from './options';
import dynamic from 'next/dynamic';

const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export const columns: ColumnDef<Membership>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama Lokasi' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['name']>()}</div>,
    meta: {
      label: 'Nama Lokasi',
      placeholder: 'Cari...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
      id: 'location',
      accessorKey: 'location',
      header: ({ column }: { column: Column<Membership, unknown> }) => (
        <DataTableColumnHeader column={column} title='Lokasi Cabang' />
      ),
      cell: ({ cell }) => {
        const location = cell.getValue<Membership['location']>();
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
      header: ({ column }: { column: Column<Membership, unknown> }) => (
        <DataTableColumnHeader column={column} title='Cabang Olahraga' />
      ),
      cell: ({ cell }) => {
        const sport = cell.getValue<Membership['sport']>();
        return <div>{sport}</div>;
      },
      enableColumnFilter: true,
      meta: {
        label: 'Cabang Olahraga',
        variant: 'multiSelect',
        options: SPORTS_OPTIONS
      }
    },
  {
    accessorKey: 'discount',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Potongan harga' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['sport']>()} %</div>,
    meta:{
      label: 'Potongan harga'
    }
  },
  {  
    accessorKey: 'weeks',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Jumlah Minggu' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['weeks']>()} Minggu</div>,
    meta:{
      label: 'Jumlah Minggu'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];