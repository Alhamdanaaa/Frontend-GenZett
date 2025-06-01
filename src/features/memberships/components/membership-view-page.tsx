import { Membership } from '@/constants/data';
import { notFound } from 'next/navigation';
import MembershipViewPageClient from './membership-view-page-client';
import { getMembershipById } from '@/lib/api/membership';
import { MembershipWithNames } from '@/constants/data';

interface MembershipViewPageProps {
  membershipId: string;
}

async function fetchMembership(membershipId: string): Promise<MembershipWithNames | null> {
  try {
    const data = await getMembershipById(Number(membershipId));
    // Pastikan data sudah lengkap dengan locationName dan sportName
    return data as MembershipWithNames;
  } catch (error) {
    console.error('Error fetching membership:', error);
    return null;
  }
}

export default async function MembershipViewPage({ membershipId }: MembershipViewPageProps) {
  let membership: MembershipWithNames | null = null;
  let pageTitle = 'Tambah Paket Langganan Baru';

  if (membershipId !== 'new') {
    membership = await fetchMembership(membershipId);
    if (!membership) return notFound();
    pageTitle = `Edit Paket Langganan - ${membership.name}`;
  }

  return <MembershipViewPageClient membership={membership} pageTitle={pageTitle} />;
}
