import { ColumnDef } from '@tanstack/react-table';
import { Field } from '@/constants/data';
import { Text } from 'lucide-react';
import dynamic from 'next/dynamic';

const CellAction = dynamic(() => import('./cell-action').then(mod => mod.CellAction), {
  ssr: false
});

export function getColumns(
  locationOptions: { label: string; value: string }[],
  sportOptions: { label: string; value: string }[],
  isAdmin?: boolean
): ColumnDef<Field>[] {
  const columns: ColumnDef<Field>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Nama Lapangan',
      cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
      meta: {
        label: 'Nama Lapangan',
        placeholder: 'Cari...',
        variant: 'text',
        icon: Text
      },
      enableColumnFilter: true
    },
    {
      id: 'sport',
      accessorKey: 'sport',
      header: 'Cabang Olahraga',
      cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
      enableColumnFilter: true,
      meta: {
        label: 'Cabang Olahraga',
        variant: 'select',
        options: sportOptions
      }
    },
    {
      accessorKey: 'jamMulai',
      header: 'Jam Operasi',
      cell: ({ row }) => {
        const jamMulai = row.original.startHour;
        const jamTutup = row.original.endHour;
        return <div>{jamMulai?.slice(0, 5)} - {jamTutup?.slice(0, 5)}</div>;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
    }
  ];

  if (!isAdmin) {
    columns.splice(1, 0, {
      id: 'location',
      accessorKey: 'location',
      header: 'Lokasi Cabang',
      cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
      enableColumnFilter: true,
      meta: {
        label: 'Lokasi Cabang',
        variant: 'select',
        options: locationOptions
      }
    });
  }

  return columns;
}
