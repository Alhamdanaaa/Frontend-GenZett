'use client';

import dynamic from 'next/dynamic';
import { Membership } from '@/constants/data';

const MembershipTable = dynamic(
  () => import('./membership-tables').then(mod => mod.MembershipTable),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

type Props = {
  data: Membership[];
  totalItems: number;
  columns: any;
};

export default function MembershipTableWrapper({ data, totalItems, columns }: Props) {
  return (
    <MembershipTable data={data} totalItems={totalItems} columns={columns} />
  );
}
