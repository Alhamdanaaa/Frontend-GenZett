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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/constants/data';
import { createField, updateField } from '@/lib/api/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama lapangan minimal 2 karakter.'
  }),
  location: z.string({
    required_error: 'Lokasi harus dipilih.'
  }),
  sport: z.string({
    required_error: 'Cabang olahraga harus dipilih.'
  }),
  startHour: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format jam mulai harus HH:MM (24 jam).'
  }),
  endHour: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format jam tutup harus HH:MM (24 jam).'
  }),
  description: z.string().min(10, {
    message: 'Deskripsi minimal 10 karakter.'
  })
});

export default function FieldForm({
  initialData,
  pageTitle,
  locationOptions,
  sportOptions,
}: {
  initialData: Field | null;
  pageTitle: string;
  locationOptions: { value: string; label: string }[];
  sportOptions: { value: string; label: string }[];
}) {
  const defaultValues = {
    name: initialData?.name ?? '',
    location: initialData?.location ? String(initialData.location) : '',
    sport: initialData?.sport ? String(initialData.sport) : '',
    startHour: initialData?.startHour?.slice(0, 5) ?? '08:00',
    endHour: initialData?.endHour?.slice(0, 5) ?? '23:00',
    description: initialData?.description ?? ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted:', values);
    try {
      if (initialData) {
        await updateField(initialData.id, values);
      } else {
        await createField(values);
      }
      
      router.push('/dashboard/field');
    } catch (error) {
      console.error('Gagal menyimpan lapangan:', error);
    }
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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lapangan</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan nama lapangan' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih lokasi' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationOptions.map((location) => (
                          <SelectItem key={location.value} value={location.value}>
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='sport'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabang Olahraga</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih cabang olahraga' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sportOptions.map((sport) => (
                          <SelectItem key={sport.value} value={sport.value}>
                            {sport.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='startHour'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Mulai</FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        step={3600}  // step 3600 detik = 1 jam
                        placeholder='Jam Mulai'
                        {...field}
                        onChange={(e) => {
                          // Pastikan menit selalu 00, meski user coba ubah
                          const time = e.target.value;
                          // time biasanya dalam format "HH:MM"
                          const [hour] = time.split(':');
                          const fixedTime = `${hour}:00`;
                          field.onChange(fixedTime);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endHour'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Tutup</FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        step={3600}  // step 3600 detik = 1 jam
                        placeholder='Jam Tutup'
                        {...field}
                        onChange={(e) => {
                          // Pastikan menit selalu 00, meski user coba ubah
                          const time = e.target.value;
                          // time biasanya dalam format "HH:MM"
                          const [hour] = time.split(':');
                          const fixedTime = `${hour}:00`;
                          field.onChange(fixedTime);
                        }}
                        value={field.value}
                      />
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
                      placeholder='Masukkan deskripsi lapangan'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Simpan Lapangan</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
