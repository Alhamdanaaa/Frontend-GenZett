import { fakeMembers } from '@/constants/mock-api';
import { Member } from '@/constants/data';
import { notFound } from 'next/navigation';
import MemberForm from './member-list-form';

type TMemberViewPageProps = {
  memberId: string;
};

export default async function MemberViewPage({
  memberId
}: TMemberViewPageProps) {
  let member = null;
  let pageTitle = 'Tambah Member Baru';

  if (memberId !== 'new') {
    const data = await fakeMembers.getMemberById(Number(memberId));
    member = data.member as Member;
    if (!member) {
      notFound();
    }
    pageTitle = `Edit member`;
  }

  return <MemberForm initialData={member} pageTitle={pageTitle} />;
}