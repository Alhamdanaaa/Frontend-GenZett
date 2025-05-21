'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Location } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Image from 'next/image';
import { SPORTS_OPTIONS } from './options';
import dynamic from 'next/dynamic';
import { getAllSports } from '@/lib/api/location';

const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: 'img',
    header: 'Gambar',
    meta:{
      label: 'Gambar'
    },
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square w-16 h-16'>
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${row.getValue('img')}`}
            alt= ''
            // alt={row.getValue('name')}
            fill
            className='rounded-lg object-cover'
          />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'locationName',
    header: 'Nama Lokasi',
    cell: ({ cell }) => <div>{cell.getValue<Location['locationName']>()}</div>,
    meta: {
      label: 'Nama Lokasi',
      placeholder: 'Cari...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'sport',
    accessorKey: 'sports',
    header: 'Cabang Olahraga',
    cell: ({ cell }) => {
      const sports = cell.getValue<Location['sports']>();
      return (
        <div className='flex flex-wrap gap-1'>
          {sports.map((sport) => (
            <Badge key={sport} variant='outline' className='capitalize'>
              {sport}
            </Badge>
          ))}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Cabang Olahraga',
      variant: 'select',
      options: SPORTS_OPTIONS
      // options: async () => {
      //   const sports = await getAllSports();
      //   return sports.map(sport => ({
      //     label: sport.sportName,
      //     value: sport.sportId
      //   }));
      // }
    }
  },
  {
    accessorKey: 'countLap',
    header: 'Jumlah Lapangan',
    cell: ({ cell }) => {
      const count = cell.getValue<Location['countLap']>();
      return <div>{count} Lapangan</div>;
    },
    meta:{
      label: 'Jumlah Lapangan'
    }
  },
  {
    accessorKey: 'address',
    header: 'Alamat',
    cell: ({ cell }) => {
      const address = cell.getValue<Location['address']>();
      return <div className='max-w-[200px] truncate'>{address}</div>;
    },
    meta:{
      label: 'Alamat'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];