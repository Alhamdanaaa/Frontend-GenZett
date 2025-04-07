'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Sport } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Sport>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Cabang Olahraga' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Sport['name']>()}</div>,
    filterFn: 'includesString',
    meta: {
      label: 'Name',
      placeholder: 'Cari cabor...',
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
    header: ({ column }: { column: Column<Sport, unknown> }) => (
      <DataTableColumnHeader column={column} title='Deskripsi' />
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
