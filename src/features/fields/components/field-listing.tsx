import { Field } from '@/constants/data';
import { fakeFields } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { FieldTable } from './field-tables';
import { columns } from './field-tables/columns';

type FieldListingPage = {};

export default async function FieldListingPage({}: FieldListingPage) {
  // Penggunaan cache search params di Render Server Components
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
  const totalFields = data.total_fields;
  const fields: Field[] = data.fields;

  return (
    <FieldTable
      data={fields}
      totalItems={totalFields}
      columns={columns}
    />
  );
}