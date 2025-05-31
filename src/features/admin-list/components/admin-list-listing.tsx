import { getAdmins } from '@/lib/api/admin';
import { searchParamsCache } from '@/lib/searchparams';
import AdminTableWrapper from './admin-list-table-wrapper';
import { getAllLocations } from '@/lib/api/location';

export default async function AdminListListingPage() {
  const page = Number(searchParamsCache.get('page')) || 1;
  const search = searchParamsCache.get('name') || '';
  const pageLimit = Number(searchParamsCache.get('perPage')) || 10;
  const locationParam = searchParamsCache.get('location') || '';

  // Jika locationParam berupa string CSV "1,2,3", ubah jadi array
  const locationIds = locationParam ? locationParam.split(',') : [];

  const filters = {
    page: page.toString(),
    limit: pageLimit.toString(),
    ...(search && { search }),
    ...(locationIds.length > 0 && { locationIds }), // sesuaikan key dengan backend
  };

  const data = await getAdmins(filters);

  try {
    const [locationData] = await Promise.all([
      getAllLocations(),
    ]);

    const locationOptions = locationData.map((loc: any) => ({
      label: loc.name,
      value: String(loc.id),
    }));

    return (
      <AdminTableWrapper
        data={data.admins}
        totalItems={data.totalAdmins}
        locationOptions={locationOptions}
      />
    );
  } catch (error) {
    console.error('Error in AdminListListingPage:', error);
    return (
      <div className="p-4 text-red-500">
        Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.
      </div>
    );
  }
}