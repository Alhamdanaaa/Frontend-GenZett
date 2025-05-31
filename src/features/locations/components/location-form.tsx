'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Location } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import dynamic from 'next/dynamic';

const FileUploader = dynamic(
  () => import('@/components/file-uploader').then((mod) => mod.FileUploader),
  {
    ssr: false,
    loading: () => <Skeleton className="h-32 w-full" />
  }
);

import { Skeleton } from '@/components/ui/skeleton';
import { createLocation, updateLocation } from '@/lib/api/location';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = (isEdit: boolean) =>
  z.object({
    img: isEdit
      ? z.any().optional() // saat edit, gambar boleh kosong
      : z
          .any()
          .refine((files) => files?.length == 1, 'Gambar lokasi diperlukan.')
          .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            `Ukuran file maksimal 5MB.`
          )
          .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            'Hanya menerima file .jpg, .jpeg, .png dan .webp.'
          ),
    locationName: z.string().min(2, { message: 'Nama lokasi minimal 2 karakter.' }),
    address: z.string().min(5, { message: 'Alamat minimal 5 karakter.' }),
    description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter.' })
  });


  export default function LocationForm({
    initialData,
    pageTitle
  }: {
    initialData: Location | null;
    pageTitle: string;
  }) {

  const isEdit = !!initialData;
  const defaultValues = {
    locationName: initialData?.locationName ?? '',
    address: initialData?.address ?? '',
    description: initialData?.description ?? '',
    img: undefined, // biarkan kosong saat edit, kecuali user upload baru
  };
  // const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
  //   resolver: zodResolver(formSchema(isEdit)),
  //   values: {
  //     locationName: initialData?.locationName ?? '',
  //     address: initialData?.address ?? '',
  //     description: initialData?.description ?? '',
  //     img: undefined, // biarkan kosong saat edit, kecuali user upload baru
  //   },
  //   mode: 'onBlur'
  // });

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(isEdit)), // 2. Gunakan nilai schema yang dikompilasi
    defaultValues
  });
  useEffect(() => {
    if (initialData) {
      form.reset({
        locationName: initialData.locationName,
        address: initialData.address,
        description: initialData.description,
        img: undefined,
      });
    }
  }, [initialData, form]);
  const router = useRouter();

  // 2. Gunakan nilai schema yang dikompilasi
  const compiledSchema = formSchema(isEdit);

  async function onSubmit(values: z.infer<typeof compiledSchema>) {
    console.log('locationName:', values.locationName); // pastikan bukan undefined
    console.log('address:', values.address); // pastikan bukan undefined
    console.log('description:', values.description); // pastikan bukan undefined

    try {
      if (isEdit) {
        await updateLocation(initialData!.locationId, values);
      } else {
        await createLocation(values);
      }

      router.push('/dashboard/location');
    } catch (error) {
      console.error('Gagal menyimpan lokasi:', error);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='img'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Gambar Lokasi</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFiles={4}
                      maxSize={4 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='locationName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan nama lokasi' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan alamat lokasi' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan deskripsi lokasi'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Lokasi'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
