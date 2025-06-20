'use client';

import dynamic from 'next/dynamic';
import { Reservation } from '@/constants/data';

const AvailabilityTable = dynamic(
  () => import('./availabiliy-field-tables').then(mod => mod.AvailabilityTable),
);

type Props = {
  data: Reservation[];
  totalItems: number;
  columns: any
};

export default function AvailabilityTableWrapper({ data, totalItems, columns}: Props) {
  return (
    <AvailabilityTable data={data} totalItems={totalItems} columns={columns} />
  );
}
