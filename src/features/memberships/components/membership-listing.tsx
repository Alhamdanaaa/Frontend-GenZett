import { searchParamsCache } from '@/lib/searchparams';
import MembershipTableWrapper from './membership-table-wrapper';
import { getMemberships } from '@/lib/api/membership';

const getColumns = async () => {
  try {
    // Pastikan mengimpor columns dengan benar
    const { useMembershipColumns } = await import('./membership-tables/columns');
    // Jika columns adalah fungsi (tidak langsung nilai kolom), panggil fungsinya
    return useMembershipColumns;
  } catch (error) {
    console.error('Error loading columns:', error);
    return []; // Kembalikan array kosong jika gagal memuat columns
  }
};

export default async function MembershipListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const sports = searchParamsCache.get('sport');
  const locations = searchParamsCache.get('location');
  const pageLimit = searchParamsCache.get('perPage');
  
  const filters = {
    page: page?.toString() || '1', // Default ke halaman 1 jika undefined
    limit: pageLimit?.toString() || '10', // Default ke 10 item per halaman
    ...(search && { search }),
    ...(sports && { sports: sports.split(',').map(Number) }),   
    ...(locations && { locations: locations.split(',').map(Number) })
  };

  try {
    // Pastikan mendapatkan data dengan benar
    const memberships = await getMemberships(filters);
    const columns = await getColumns();
    
    // Pastikan data dan kolom valid sebelum meneruskannya
    const safeData = memberships?.data || [];
    const totalItems = Array.isArray(safeData) ? safeData.length : 0;
    
    return (
      <MembershipTableWrapper
        data={safeData}
        totalItems={totalItems}
        columns={columns}
      />
    );
  } catch (error) {
    console.error('Error in MembershipListingPage:', error);
    // Tampilkan pesan error jika gagal memuat data
    return (
      <div className="p-4 text-red-500">
        Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.
      </div>
    );
  }
}