'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Membership } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
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
      <DataTableColumnHeader column={column} title='Nama Paket' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['name']>()}</div>,
    meta: {
      label: 'Nama Paket',
      placeholder: 'Cari...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Deskripsi' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['description']>()}</div>,
    meta: {
      label: 'Deskripsi'
    }
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Lokasi Cabang' />
    ),
    cell: ({ cell }) => {
      const location = cell.getValue<Membership['locations']>();
      return <div>{location?.locationName || 'N/A'}</div>;
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
      const sport = cell.getValue<Membership['sports']>();
      return <div>{sport?.sportName || 'N/A'}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Cabang Olahraga',
      variant: 'multiSelect',
      options: SPORTS_OPTIONS
    }
  },
  {
    accessorKey: 'price',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Harga' />
    ),
    cell: ({ cell }) => <div>Rp. {cell.getValue<Membership['price']>()}</div>,
    meta: {
      label: 'Harga'
    }
  },
  {
    accessorKey: 'weeks',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Jumlah Minggu' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['weeks']>()} Minggu</div>,
    meta: {
      label: 'Jumlah Minggu'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];