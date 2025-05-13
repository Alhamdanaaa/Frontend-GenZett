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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { LOCATION_OPTIONS, SPORTS_OPTIONS } from './membership-tables/options'; // Sesuaikan nama file jika beda
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Membership } from '@/constants/data';

const formSchema = z.object({
  location: z.string().min(2, { message: 'Lokasi minimal 2 karakter.' }),
  sport: z.string().min(1, { message: 'Cabang olahraga wajib dipilih.' }),
  name: z.string().min(2, { message: 'Nama membership minimal 2 karakter.' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter.' }),
  discount: z.string().min(1, { message: 'Diskon tidak boleh kosong.' }),
  weeks: z.string().min(1, { message: 'Durasi minggu harus diisi.' })
});

export default function MembershipForm({
  initialData,
  pageTitle
}: {
  initialData: Membership | null;
  pageTitle: string;
}) {
  const defaultValues = {
    location: initialData?.location || '',
    sport: initialData?.sport || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    discount: initialData?.discount || '',
    weeks: initialData?.weeks || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur'
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Membership submitted:', values);
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
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih Lokasi' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOCATION_OPTIONS.map((location) => (
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih olahraga' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPORTS_OPTIONS.map((sport) => (
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Membership</FormLabel>
                  <FormControl>
                    <Input placeholder='Masukkan nama membership' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan deskripsi membership'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='discount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diskon</FormLabel>
                  <FormControl>
                    <Input placeholder='Contoh: 10%' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='weeks'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durasi (Minggu)</FormLabel>
                  <FormControl>
                    <Input placeholder='Contoh: 4 minggu' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Simpan Membership</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
