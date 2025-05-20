'use client';

import dynamic from 'next/dynamic';
import { Membership } from '@/constants/data';

// Perbaikan: Pastikan komponen MembershipTable diekspor dengan benar dari file
// Opsi 1: Jika MembershipTable adalah ekspor default
const MembershipTable = dynamic(
  () => import('./membership-tables'),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

// Opsi 2: Jika MembershipTable adalah ekspor bernama
// const MembershipTable = dynamic(
//   () => import('./membership-tables').then(mod => mod.MembershipTable),
//   { ssr: false, loading: () => <p>Loading table...</p> }
// );

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