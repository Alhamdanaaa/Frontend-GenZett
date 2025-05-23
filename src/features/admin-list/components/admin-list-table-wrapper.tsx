'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { AdminOutput as Admin } from '@/constants/data';
import type { ColumnDef } from '@tanstack/react-table';

const AdminTable = dynamic(
  () => import('./admin-list-tables').then(mod => mod.AdminTable),
  { ssr: false }
);

type Props = {
  data: Admin[];
  totalItems: number;
  locationOptions: { label: string; value: string }[];
};

export default function AdminTableWrapper({ data, totalItems, locationOptions }: Props) {
  const [columns, setColumns] = useState<ColumnDef<Admin>[]>([]);

  useEffect(() => {
    const loadColumns = async () => {
      const { getColumns } = await import('./admin-list-tables/columns');
      const cols = getColumns(locationOptions); 
      setColumns(cols);
    };

    loadColumns();
  }, [locationOptions]);

  if (!columns.length) return <p>Memuat kolom tabel...</p>;

  return (
    <AdminTable
      data={data}
      totalItems={totalItems}
      columns={columns}
    />
  );
}