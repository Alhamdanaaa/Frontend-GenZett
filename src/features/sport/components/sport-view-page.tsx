import { Sport } from '@/constants/data';
import { notFound } from 'next/navigation';
import SportViewPageClient from './sport-view-page-client';
import { fakeSports } from '@/constants/mock-api';

interface SportViewPageProps {
  sportId: string;
}

async function fetchSport(sportId: string): Promise<Sport | null> {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sports/${sportId}`, {
    //   cache: 'no-store'
    // });
    // if (!res.ok) {
    //   throw new Error('Sport not found');
    // }
    // const data = await res.json();
    const data = await fakeSports.getSportById(Number(sportId));
    return data.sport as Sport;
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
