import { Field } from '@/constants/data';
import { notFound } from 'next/navigation';
import FieldViewPageClient from './field-view-page-client';
import { fakeFields } from '@/constants/mock-api';

interface FieldViewPageProps {
  fieldId: string;
}

async function fetchField(fieldId: string): Promise<Field | null> {
  try {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/field/${fieldId}`, {
    //   cache: 'no-store'
    // });
    // if (!res.ok) {
    //   throw new Error('Field not found');
    // }
    // const data = await res.json();
    const data = await fakeFields.getFieldById(Number(fieldId));
    return data.field as Field;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function FieldViewPage({ fieldId }: FieldViewPageProps) {
  let field: Field | null = null;
  let pageTitle = 'Tambah Field Baru';

  if (fieldId !== 'new') {
    field = await fetchField(fieldId);
    if (!field) {
      notFound();
    }
    pageTitle = `Edit Lapangan - ${field.name}`;
  }

  return <FieldViewPageClient field={field} pageTitle={pageTitle} />;
}
