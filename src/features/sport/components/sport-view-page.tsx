import { fakeSports } from '@/constants/mock-api';
import { Sport } from '@/constants/data';
import { notFound } from 'next/navigation';
import SportForm from './sport-form';

type TSportViewPageProps = {
  sportId: string;
};

export default async function SportViewPage({
  sportId
}: TSportViewPageProps) {
  let sport = null;
  let pageTitle = 'Tambah Cabang Olahraga';

  if (sportId !== 'new') {
    const data = await fakeSports.getSportById(Number(sportId));
    sport = data.sport as Sport;
    if (!sport) {
      notFound();
    }
    pageTitle = 'Edit Cabang Olahraga';
  }

  return <SportForm initialData={sport} pageTitle={pageTitle} />;
}
