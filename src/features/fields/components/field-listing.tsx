import { getFields } from '@/lib/api/field';
import { searchParamsCache } from '@/lib/searchparams';
import FieldTableWrapper from './field-table-wrapper';
import { getAllLocations } from '@/lib/api/location';
import { getAllSports } from '@/lib/api/sports';

export default async function FieldListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const locations = searchParamsCache.get('location');
  const sports = searchParamsCache.get('sport');

  const filters = {
    page: page?.toString(),
    limit: pageLimit?.toString(),
    ...(search && { search }),
    ...(locations && { locations }),
    ...(sports && { sports })
  };

  const data = await getFields(filters);
  const [locationData, sportData] = await Promise.all([
    getAllLocations(),
    getAllSports()
  ]);

  const locationOptions = locationData.map((loc: any) => ({
    label: loc.name,
    value: String(loc.id),
  }));

  const sportOptions = sportData.map((sport: any) => ({
    label: sport.name,
    value: String(sport.id),
  }));

  return (
    <FieldTableWrapper
      data={data.fields}
      totalItems={data.totalFields}
      locationOptions={locationOptions}
      sportOptions={sportOptions}
    />
  );
}
