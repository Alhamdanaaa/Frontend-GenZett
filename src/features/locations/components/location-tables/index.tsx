'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';

interface LocationTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

export function LocationTable<TData, TValue>({
  data,
  totalItems,
  columns
}: LocationTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  // Memoize values to prevent unnecessary re-renders
  const pageCount = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);
  
  const { table } = useDataTable({
    data, // location data
    columns, // location columns
    pageCount,
    shallow: false // Setting to false triggers a network request with the updated querystring
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}