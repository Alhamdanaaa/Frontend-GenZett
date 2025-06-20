'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Field } from '@/constants/data';
import dynamic from 'next/dynamic';
import { getColumns as getServerColumns } from './columns';

const CellAction = dynamic(
  () => import('./cell-action').then(mod => mod.CellAction),
  { ssr: false, loading: () => <div>Memuat...</div> }
);

export function getClientColumns(
  locationOptions: { label: string; value: string }[],
  sportOptions: { label: string; value: string }[]
): ColumnDef<Field>[] {
  // Get the base columns from the server-side function
  const columns = getServerColumns(locationOptions, sportOptions);
  
  // Replace the placeholder CellAction with the real dynamic import
  const actionsColumnIndex = columns.findIndex(col => col.id === 'actions');
  if (actionsColumnIndex !== -1) {
    columns[actionsColumnIndex] = {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} />
    };
  }
  
  return columns;
}