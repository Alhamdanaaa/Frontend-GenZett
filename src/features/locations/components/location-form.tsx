'use client';

import { FileUploader } from '@/components/file-uploader';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Location } from '@/constants/mock-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const SPORTS_OPTIONS = [
  'Futsal',
  'Badminton', 
  'Basketball', 
  'Volleyball', 
  'Tennis', 
  'Sepak Bola', 
  'Handball'
];

const formSchema = z.object({
  img: z
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
  name: z.string().min(2, {
    message: 'Nama lokasi minimal 2 karakter.'
  }),
  sports: z.array(z.string()).min(1, {
    message: 'Pilih minimal satu cabang olahraga.'
  }),
  countLap: z.number().min(1, {
    message: 'Jumlah lapangan minimal 1.'
  }),
  address: z.string().min(5, {
    message: 'Alamat minimal 5 karakter.'
  }),
  desc: z.string().min(10, {
    message: 'Deskripsi minimal 10 karakter.'
  })
});

export default function LocationForm({
  initialData,
  pageTitle
}: {
  initialData: Location | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    sports: initialData?.sports || [],
    countLap: initialData?.countLap || 1,
    address: initialData?.address || '',
    desc: initialData?.desc || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Logika submit form akan diimplementasikan di sini
    console.log('Form submitted:', values);
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='img'
              render={({ field }) => (
                <div className='space-y-6'>
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
                </div>
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
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
                name='sports'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabang Olahraga</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const currentSports = field.value || [];
                        const newSports = currentSports.includes(value)
                          ? currentSports.filter(sport => sport !== value)
                          : [...currentSports, value];
                        field.onChange(newSports);
                      }}
                      value={field.value[field.value.length - 1]}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih cabang olahraga' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPORTS_OPTIONS.map((sport) => (
                          <SelectItem key={sport} value={sport}>
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {field.value?.map((sport) => (
                        <div 
                          key={sport} 
                          className='bg-primary/10 px-2 py-1 rounded-md text-sm flex items-center'
                        >
                          {sport}
                          <button
                            type='button'
                            onClick={() => {
                              const newSports = field.value.filter(s => s !== sport);
                              field.onChange(newSports);
                            }}
                            className='ml-2 text-destructive'
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='countLap'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Lapangan</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Masukkan jumlah lapangan'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
              name='desc'
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
            <Button type='submit'>Simpan Lokasi</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}