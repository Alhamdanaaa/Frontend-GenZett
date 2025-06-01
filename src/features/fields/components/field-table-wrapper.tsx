'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Field } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';

const FieldTable = dynamic(() => import('./field-tables').then(mod => mod.FieldTable), {
  ssr: false,
  loading: () => <p>Loading table...</p>
});

type Props = {
  data: Field[];
  totalItems: number;
  locationOptions: { label: string; value: string }[];
  sportOptions: { label: string; value: string }[];
  isAdmin: boolean;
};

export default function FieldTableWrapper({
  data,
  totalItems,
  locationOptions,
  sportOptions,
  isAdmin
}: Props) {
  const [columns, setColumns] = useState<ColumnDef<Field>[]>([]);

  useEffect(() => {
    const loadColumns = async () => {
      const { getColumns } = await import('./field-tables/columns');
      const cols = getColumns(locationOptions, sportOptions, isAdmin);
      setColumns(cols);
    };

    loadColumns();
  }, [locationOptions, sportOptions, isAdmin]);

  if (columns.length === 0) return <p>Loading columns...</p>;

  return <FieldTable data={data} totalItems={totalItems} columns={columns} />;
}
