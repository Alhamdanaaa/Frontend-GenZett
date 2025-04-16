import { fakeFields } from '@/constants/mock-api';
import { Field } from '@/constants/data';
import { notFound } from 'next/navigation';
import FieldForm from './field-form';

type TFieldViewPageProps = {
  fieldId: string;
};

export default async function FieldViewPage({
  fieldId
}: TFieldViewPageProps) {
  let field = null;
  let pageTitle = 'Tambah Lapangan Baru';

  if (fieldId !== 'new') {
    const data = await fakeFields.getFieldById(Number(fieldId));
    field = data.field as Field;
    if (!field) {
      notFound();
    }
    pageTitle = `Edit Lapangan`;
  }

  return <FieldForm initialData={field} pageTitle={pageTitle} />;
}