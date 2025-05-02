'use client';

import dynamic from 'next/dynamic';
import { Location } from '@/constants/data';

const LocationTable = dynamic(
  () => import('./location-tables').then(mod => mod.LocationTable),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

type Props = {
  data: Location[];
  totalItems: number;
  columns: any;
};

export default function LocationTableWrapper({ data, totalItems, columns }: Props) {
  return (
    <LocationTable data={data} totalItems={totalItems} columns={columns} />
  );
}
