'use client';
import { Sport } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';

const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Memuat...</div> }
);

export const columns: ColumnDef<Sport>[] = [
  {
    id: 'name',
    accessorKey: 'sportName',
    header: 'Nama Cabang Olahraga',
    cell: ({ cell }) => <div>{cell.getValue<Sport['sportName']>()}</div>,
    filterFn: 'includesString',
    meta: {
      label: 'Name',
      placeholder: 'Cari...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'countLocation',
    header: 'Jumlah Cabang',
    cell: ({ cell }) => {
      const count = cell.getValue<Sport['countLocation']>();
      return <div>{count} Cabang</div>;
    }
  },
  {
    id: 'description',
    accessorKey: 'description',
    header:'Deskripsi' ,
    meta:{
      label: 'Deskripsi'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
