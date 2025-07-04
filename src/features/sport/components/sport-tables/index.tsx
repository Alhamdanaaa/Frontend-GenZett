'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { Sport } from '@/constants/data';

import { useDataTable } from '@/hooks/use-data-table';

import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface SportTableParams {
  data: Sport[];
  totalItems: number;
  columns: ColumnDef<Sport>[];
}

export function SportTable({
  data,
  totalItems,
  columns
}: SportTableParams) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // Sport data
    columns, // Sport columns
    pageCount: pageCount,
    shallow: false // Setting to false triggers a network request with the updated querystring
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

export default { SportTable };