import { Membership } from '@/constants/data';
import { notFound } from 'next/navigation';
import MembershipViewPageClient from './membership-view-page-client';
import { getMembershipById } from '@/lib/api/membership';

interface MembershipViewPageProps {
  membershipId: string;
}

async function fetchMembership(membershipId: string): Promise<Membership | null> {
  try {
    const membership = await getMembershipById(Number(membershipId));
    return membership;
  } catch (error) {
    console.error('Error fetching membership:', error);
    return null;
  }
}

export default async function MembershipViewPage({ membershipId }: MembershipViewPageProps) {
  let membership: Membership | null = null;
  let pageTitle = 'Tambah Paket Langganan Baru';

  if (membershipId !== 'new') {
    membership = await fetchMembership(membershipId);
    if (!membership) {
      notFound();
    }
    pageTitle = `Edit Paket Langganan - ${membership.name}`;
  }

  return <MembershipViewPageClient membership={membership} pageTitle={pageTitle} />;
}
