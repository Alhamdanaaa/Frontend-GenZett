'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { Reservation } from '@/constants/data';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface ReservationTableParams {
  data: Reservation[];
  totalItems: number;
  columns: ColumnDef<Reservation>[];
}

export function ReservationTable({
  data,
  totalItems,
  columns
}: ReservationTableParams) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data, // Reservation data
    columns, // Reservation columns
    pageCount: pageCount,
    shallow: false // Setting to false triggers a network request with the updated querystring
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

// Default export for dynamic import
export default { ReservationTable };