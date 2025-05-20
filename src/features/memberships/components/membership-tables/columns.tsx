'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Membership } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { useSportsOptions, useLocationsOptions } from './options';
import dynamic from 'next/dynamic';

// Lazy load CellAction (client component)
const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Loading...</div> }
);

// Export kolom sebagai fungsi yang langsung bisa dijalankan
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
    accessorKey: 'locationName',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Lokasi Cabang' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['locationId']>()}</div>,
    enableColumnFilter: true,
    meta: {
      label: 'Lokasi Cabang',
      variant: 'multiSelect',
      options: [] // Akan diisi oleh hook di component
    }
  },
  {
    id: 'sport',
    accessorKey: 'sportName',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Cabang Olahraga' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['sportId']>()}</div>,
    enableColumnFilter: true,
    meta: {
      label: 'Cabang Olahraga',
      variant: 'multiSelect',
      options: [] // Akan diisi oleh hook di component
    }
  },
  {
    accessorKey: 'discount',
    header: ({ column }: { column: Column<Membership, unknown> }) => (
      <DataTableColumnHeader column={column} title='Diskon' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Membership['discount']>()}%</div>,
    meta: {
      label: 'Diskon'
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

// Fungsi hook useColumns yang menggunakan options dari hooks lainnya
export function useMembershipColumns(): ColumnDef<Membership>[] {
  const locationOptions = useLocationsOptions();
  const sportsOptions = useSportsOptions();
  
  // Salin array kolom dan update meta.options untuk lokasi dan olahraga
  return columns.map(column => {
    if (column.id === 'location') {
      return {
        ...column,
        meta: {
          ...column.meta,
          options: locationOptions
        }
      };
    }
    if (column.id === 'sport') {
      return {
        ...column,
        meta: {
          ...column.meta,
          options: sportsOptions
        }
      };
    }
    return column;
  });
}