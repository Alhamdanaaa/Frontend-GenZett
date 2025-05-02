'use client';

import dynamic from 'next/dynamic';
import { Sport } from '@/constants/data';

const SportTable = dynamic(
  () => import('./sport-tables').then(mod => mod.SportTable),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

type Props = {
  data: Sport[];
  totalItems: number;
  columns: any;
};

export default function SportTableWrapper({ data, totalItems, columns }: Props) {
  return (
    <SportTable data={data} totalItems={totalItems} columns={columns} />
  );
}
