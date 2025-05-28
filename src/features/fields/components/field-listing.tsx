import { getFields } from '@/lib/api/field';
import { searchParamsCache } from '@/lib/searchparams';
import FieldTableWrapper from './field-table-wrapper';
import { getAllLocations } from '@/lib/api/location';
import { getAllSports } from '@/lib/api/sports';
import { getUserFromServer } from '@/hooks/use-user';

export default async function FieldListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const sports = searchParamsCache.get('sport');
  const queryLocation = searchParamsCache.get('location');

  const user = await getUserFromServer();
  const isAdmin = user?.role === 'admin';

  // ✅ Tentukan location berdasarkan role
  const locationFilter =
    user?.role === 'admin'
      ? String(user?.locationId) // dari token
      : queryLocation?.toString(); // dari query param

  const filters = {
    page: page?.toString(),
    limit: pageLimit?.toString(),
    ...(search && { search }),
    ...(locationFilter && { locations: locationFilter }), // pakai hasil dari logika role
    ...(sports && { sports }),
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
      isAdmin={isAdmin} 
    />
  );
}
