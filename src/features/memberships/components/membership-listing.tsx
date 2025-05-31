import { getMemberships } from '@/lib/api/membership';
import { searchParamsCache } from '@/lib/searchparams';
import MembershipTableWrapper from './membership-table-wrapper';
import { getAllLocations } from '@/lib/api/location';
import { getAllSports } from '@/lib/api/sports';

export default async function MembershipListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const locations = searchParamsCache.get('location');
  const sports = searchParamsCache.get('sport');

  const filters = {
    page: page?.toString(),
    limit: pageLimit?.toString(),
    ...(search && { search }),
    ...(sports && { sports }),
    ...(locations && { locations }),
  };

  const data = await getMemberships(filters);

  try {
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
      <MembershipTableWrapper
        data={data.data ?? []}
        totalItems={data.totalMemberships ?? 0}
        locationOptions={locationOptions}
        sportOptions={sportOptions}
      />
    );
  } catch (error) {
    console.error('Error in MembershipListingPage:', error);
    return (
      <div className="p-4 text-red-500">
        Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.
      </div>
    );
  }
}
