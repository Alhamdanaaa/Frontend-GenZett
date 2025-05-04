'use client';

import dynamic from 'next/dynamic';
import { User } from '@/constants/data';

const UserTable = dynamic(
  () => import('./user-list-tables').then(mod => mod.UserTable),
  { ssr: false, loading: () => <p>Loading table...</p> }
);

type Props = {
  data: User[];
  totalItems: number;
  columns: any;
};

export default function UserTableWrapper({ data, totalItems, columns }: Props) {
  return (
    <UserTable data={data} totalItems={totalItems} columns={columns} />
  );
}
