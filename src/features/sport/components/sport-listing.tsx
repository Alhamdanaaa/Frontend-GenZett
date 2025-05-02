import { fakeSports } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import SportTableWrapper from './sport-table-wrapper';

const getColumns = async () => {
  const { columns } = await import('./sport-tables/columns');
  return columns;
};

export default async function SportListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const data = await fakeSports.getSports(filters); // Ambil semua data sport
  const columns = await getColumns();

  return (
    <SportTableWrapper
      data={data.sports}
      totalItems={data.totalSports}
      columns={columns}
    />
  );
}
