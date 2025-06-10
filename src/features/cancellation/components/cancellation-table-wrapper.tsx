'use client';

import dynamic from 'next/dynamic';
import { Reservation } from '@/constants/data';

const CancellationTable = dynamic(
  () => import('./cancellation-tables').then(mod => mod.CancellationTable),
  { ssr: false, loading: () => <p>Memuat tabel...</p> }
);

type Props = {
  data: Reservation[];
  totalItems: number;
  columns: any;
};

export default function CancellationTableWrapper({ data, totalItems, columns }: Props) {
  return (
    <CancellationTable data={data} totalItems={totalItems} columns={columns} />
  );
}
