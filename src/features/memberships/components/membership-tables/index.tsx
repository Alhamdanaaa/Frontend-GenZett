'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';

interface MembershipTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[] | any; // Tambahkan 'any' untuk mengatasi masalah type
}

export default function MembershipTable<TData = unknown, TValue = unknown>({
  data,
  totalItems,
  columns
}: MembershipTableParams<TData, TValue>) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  // Pastikan data dan columns valid sebelum digunakan
  const safeData = Array.isArray(data) ? data : [];
  // Jika columns adalah fungsi, maka panggil fungsinya
  const safeColumns = typeof columns === 'function' 
    ? columns() 
    : (Array.isArray(columns) ? columns : []);
  
  const pageCount = useMemo(() => {
    return Math.ceil((totalItems || 0) / (pageSize || 10));
  }, [totalItems, pageSize]);

  try {
    const { table } = useDataTable({
      data: safeData,
      columns: safeColumns,
      pageCount,
      shallow: false
    });

    if (!table) {
      return <p>Error: Tidak dapat membuat tabel</p>;
    }

    return (
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    );
  } catch (error) {
    console.error('Error in MembershipTable:', error);
    return <p>Terjadi kesalahan saat membuat tabel. Silakan coba lagi.</p>;
  }
}