import { fakeFields } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import FieldTableWrapper from './field-table-wrapper';

const getColumns = async () => {
  const { columns } = await import('./field-tables/columns');
  return columns;
};

export default async function FieldListingPage() {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const locations = searchParamsCache.get('location');
  const sports = searchParamsCache.get('sport');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(locations && { locations: locations }),
    ...(sports && { sports: sports })
  };

  const data = await fakeFields.getFields(filters);
  const columns = await getColumns();

  return (
    <FieldTableWrapper
      data={data.fields}
      totalItems={data.totalFields}
      columns={columns}
    />
  );
}