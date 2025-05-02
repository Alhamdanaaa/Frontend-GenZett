'use client';

import dynamic from 'next/dynamic';
import { Reservation } from '@/constants/data';

const ReservationTable = dynamic(
  () => import('./reservation-tables').then(mod => mod.ReservationTable),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

type Props = {
  data: Reservation[];
  totalItems: number;
  columns: any;
};

export default function ReservationTableWrapper({ data, totalItems, columns }: Props) {
  return (
    <ReservationTable data={data} totalItems={totalItems} columns={columns} />
  );
}
