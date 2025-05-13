import { Membership } from '@/constants/data';
import { notFound } from 'next/navigation';
import MembershipViewPageClient from './membership-view-page-client';
import { fakeMemberships } from '@/constants/mock-api';

interface MembershipViewPageProps {
  membershipId: string;
}

async function fetchMembership(membershipId: string): Promise<Membership | null> {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memberships/${membershipId}`, {
    //   cache: 'no-store'
    // });
    // if (!res.ok) {
    //   throw new Error('Membership not found');
    // }
    // const data = await res.json();
    const data = await fakeMemberships.getMembershipById(Number(membershipId));
    return data.membership as Membership;
  } catch (error) {
    console.error(error);
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
