'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Location } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';

const LocationTable = dynamic(() => import('./location-tables').then(mod => mod.LocationTable), {
  ssr: false,
  loading: () => <p>Memuat tabel...</p>
});

type Props = {
  data: Location[];
  totalItems: number;
  sportOptions: { label: string; value: string }[];
};

export default function LocationTableWrapper({
  data,
  totalItems,
  sportOptions,
}: Props) {
  const [columns, setColumns] = useState<ColumnDef<Location>[]>([]);

  useEffect(() => {
    const loadColumns = async () => {
      const { getColumns } = await import('./location-tables/columns');
      const cols = getColumns(sportOptions);
      setColumns(cols);
    };

    loadColumns();
  }, [sportOptions]);

  if (columns.length === 0) return <p>Memuat Kolom...</p>;

  return (
    <LocationTable data={data} totalItems={totalItems} columns={columns} />
  );
}
