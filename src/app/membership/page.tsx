import { Metadata } from 'next';
import MembershipPage from './views/page';

export const metadata: Metadata = {
  title: 'Paket Langganan',
};

export default function Page() {
  return <MembershipPage />;
}
