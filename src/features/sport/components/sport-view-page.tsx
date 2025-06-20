import { Sport } from '@/constants/data';
import { notFound } from 'next/navigation';
import SportViewPageClient from './sport-view-page-client';
import { getSportById } from '@/lib/api/sports';

interface SportViewPageProps {
  sportId: string;
}

async function fetchSport(sportId: string): Promise<Sport | null> {
  try {
    const data = await getSportById(Number(sportId));
    return data as Sport;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function SportViewPage({ sportId }: SportViewPageProps) {
  let sport: Sport | null = null;
  let pageTitle = 'Tambah Cabang Olahraga Baru';
  
  if (sportId !== 'new') {
    sport = await fetchSport(sportId);
    if (!sport) {
      notFound();
    }
    pageTitle = `Edit Cabang Olahraga - ${sport.sportName}`;
  }

  return <SportViewPageClient sport={sport} pageTitle={pageTitle} />;
}
