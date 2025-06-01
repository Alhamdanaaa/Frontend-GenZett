'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { Location } from '@/constants/data'; // pastikan import Location yang benar

interface LocationTableParams {
  data: Location[];
  totalItems: number;
  columns: ColumnDef<Location>[];
}

export function LocationTable({ data, totalItems, columns }: LocationTableParams) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
