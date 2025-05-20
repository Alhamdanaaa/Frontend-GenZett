import { Metadata } from 'next';
import MembershipPage from './views/page';

export const metadata: Metadata = {
  title: 'Membership',
};

export default function Page() {
  return <MembershipPage />;
}
