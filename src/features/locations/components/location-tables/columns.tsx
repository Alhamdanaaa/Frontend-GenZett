'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Location } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { SPORTS_OPTIONS } from './options';

export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: 'img',
    header: 'GAMBAR',
    cell: ({ row }) => {
      return (
        <div className='relative aspect-square w-16 h-16'>
          <Image
            src={row.getValue('img')}
            alt={row.getValue('name')}
            fill
            className='rounded-lg object-cover'
          />
        </div>
      );
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Location, unknown> }) => (
      <DataTableColumnHeader column={column} title='Nama Lokasi' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Location['name']>()}</div>,
    meta: {
      label: 'Nama',
      placeholder: 'Cari lokasi...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'sports',
    accessorKey: 'sports',
    header: ({ column }: { column: Column<Location, unknown> }) => (
      <DataTableColumnHeader column={column} title='Cabang Olahraga' />
    ),
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
      variant: 'multiSelect',
      options: SPORTS_OPTIONS
    }
  },
  {
    accessorKey: 'countLap',
    header: 'Jumlah Lapangan',
    cell: ({ cell }) => {
      const count = cell.getValue<Location['countLap']>();
      return <div>{count} Lapangan</div>;
    }
  },
  {
    accessorKey: 'address',
    header: 'Alamat',
    cell: ({ cell }) => {
      const address = cell.getValue<Location['address']>();
      return <div className='max-w-[200px] truncate'>{address}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];