import { Field } from '@/constants/data';
import { fakeFields } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { FieldTable } from './field-tables';
import { columns } from './field-tables/columns';

type FieldListingPage = {};

export default async function FieldListingPage({}: FieldListingPage) {
  console.log('SPORTS:', searchParamsCache.get('sports'));
console.log('ALL PARAMS:', searchParamsCache.all());

  // Penggunaan cache search params di Render Server Components
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const sports = searchParamsCache.get('sports');
  
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
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