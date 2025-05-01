'use client';

import dynamic from 'next/dynamic';
import { Field } from '@/constants/data';

const FieldTable = dynamic(
  () => import('./field-tables').then(mod => mod.FieldTable),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

type Props = {
  data: Field[];
  totalItems: number;
  columns: any;
};

export default function FieldTableWrapper({ data, totalItems, columns }: Props) {
  return (
    <FieldTable data={data} totalItems={totalItems} columns={columns} />
  );
}
