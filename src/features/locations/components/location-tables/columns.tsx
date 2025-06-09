'use client';
import { Badge } from '@/components/ui/badge';
import { Location } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const CellAction = dynamic(() => import('./cell-action').then(mod => mod.CellAction), { ssr: false });

export function getColumns(
  sportOptions: { label: string; value: string }[]
): ColumnDef<Location>[] {

  return [
    {
      accessorKey: 'img', // ← ganti dari 'locationPath'
      header: 'Gambar',
      cell: ({ row }) => {
        const path = row.getValue('img'); // ← ambil dari 'img'
        const fileUrl = row.original.file_url;
        const baseUrl = process.env.NEXT_PUBLIC_AZURE_BLOB_URL ?? '';

        console.log('row.original:', row.original);
        console.log('fileUrl:', fileUrl);
        console.log('path:', path);

        if (!fileUrl && !path) return <span>No Image</span>;

        const imageUrl = fileUrl ?? `${baseUrl.replace(/\/$/, '')}/${path}`;

        return (
          <div className='relative w-16 h-16'>
            <Image
              src={imageUrl}
              alt='Gambar lokasi'
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
        options: sportOptions
      }
    },
    {
      accessorKey: 'countLap',
      header: 'Jumlah Lapangan',
      cell: ({ cell }) => {
        const count = cell.getValue<Location['countLap']>();
        return <div>{count} Lapangan</div>;
      },
      meta: {
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
      meta: {
        label: 'Alamat'
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ]
};