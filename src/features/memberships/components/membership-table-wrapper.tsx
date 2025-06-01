'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MembershipWithNames } from '@/constants/data';

const MembershipTable = dynamic<{
  data: MembershipWithNames[];
  totalItems: number;
  columns: ColumnDef<MembershipWithNames>[];
}>(() => import('./membership-tables').then(mod => mod.default), {
  ssr: false,
  loading: () => <p>Loading table...</p>,
});


type Props = {
  data: MembershipWithNames[];
  totalItems: number;
  locationOptions: { label: string; value: string }[];
  sportOptions: { label: string; value: string }[];
};

export default function MembershipTableWrapper({
  data,
  totalItems,
  locationOptions,
  sportOptions,
}: Props) {
  const [columns, setColumns] = useState<ColumnDef<MembershipWithNames>[]>([]);

  useEffect(() => {
    if (locationOptions.length === 0 || sportOptions.length === 0) return;

    const loadColumns = async () => {
      const { getColumns } = await import('./membership-tables/columns');
      const cols = getColumns(locationOptions, sportOptions);
      setColumns(cols);
    };

    loadColumns();
  }, [locationOptions, sportOptions]);

  if (locationOptions.length === 0 || sportOptions.length === 0)
    return <p>Loading options...</p>;

  if (columns.length === 0) return <p>Loading columns...</p>;

  return (
    <MembershipTable data={data} totalItems={totalItems} columns={columns} />
  );
}