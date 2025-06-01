'use client';

import { Membership, MembershipWithNames } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';

const CellAction = dynamic(() => import('./cell-action').then(mod => mod.CellAction), { ssr: false });

export function getColumns(
  locationOptions: { label: string; value: string }[],
  sportOptions: { label: string; value: string }[]
): ColumnDef<MembershipWithNames>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Nama Paket',
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
      header: 'Deskripsi',
      cell: ({ cell }) => <div>{cell.getValue<Membership['description']>()}</div>,
      enableColumnFilter: true,
      meta: {
        label: 'Deskripsi',
      }
    },
    {
      id: 'location',
      accessorKey: 'locationId', // tetap pakai ID buat filter
      header: 'Lokasi Cabang',
      cell: ({ row }) => row.original.locationName ?? '-',
      enableColumnFilter: true,
      meta: {
        label: 'Lokasi Cabang',
        variant: 'select',
        options: locationOptions
      }
    },
    {
      id: 'sport',
      accessorKey: 'sportId',
      header: 'Cabang Olahraga',
      cell: ({ row }) => row.original.sportName ?? '-',
      enableColumnFilter: true,
      meta: {
        label: 'Cabang Olahraga',
        variant: 'select',
        options: sportOptions
      }
    },
    {
      id: 'discount',
      accessorKey: 'discount',
      header: 'Diskon',
      cell: ({ cell }) => {
        const value = cell.getValue<Membership['discount']>();
        return <div>{value != null ? `${parseFloat(value.toString())}%` : '-'}</div>;
      },

      meta: {
        label: 'Diskon',
      },
    },
    {
      id: 'weeks',
      accessorKey: 'weeks',
      header: 'Jumlah Minggu',
      cell: ({ cell }) => <div>{cell.getValue<Membership['weeks']>()} Minggu</div>,
      meta: {
        label: 'Jumlah Minggu',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];
}