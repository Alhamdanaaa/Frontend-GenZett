import { notFound } from 'next/navigation';
import { getFieldById } from '@/lib/api/field';
import { getAllLocations } from '@/lib/api/location';
import { getAllSports } from '@/lib/api/sports';
import FieldViewPageClient from './field-view-page-client';

interface FieldViewPageProps {
  fieldId: string;
}

export default async function FieldViewPage({ fieldId }: FieldViewPageProps) {
  let field = null;
  let pageTitle = 'Tambah Field Baru';

  if (fieldId !== 'new') {
    field = await getFieldById(Number(fieldId));
    if (!field) notFound();
    pageTitle = `Edit Lapangan - ${field.name}`;
  }

  const [locationData, sportData] = await Promise.all([
    getAllLocations(),
    getAllSports()
  ]);

  const locationOptions = locationData.map((loc: any) => ({
    label: loc.name,
    value: String(loc.id)
  }));

  const sportOptions = sportData.map((sport: any) => ({
    label: sport.name,
    value: String(sport.id)
  }));

  return (
    <FieldViewPageClient
      field={field}
      pageTitle={pageTitle}
      locationOptions={locationOptions}
      sportOptions={sportOptions}
    />
  );
}
