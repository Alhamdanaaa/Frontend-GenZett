'use client';

import dynamic from 'next/dynamic';
import { Admin } from '@/constants/data';

const AdminTable = dynamic(
  () => import('./admin-list-tables').then(mod => mod.AdminTable),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

type Props = {
  data: Admin[];
  totalItems: number;
  columns: any;
};

export default function AdminTableWrapper({ data, totalItems, columns }: Props) {
  return (
    <AdminTable data={data} totalItems={totalItems} columns={columns} />
  );
}
