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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LOCATION_OPTIONS, SPORTS_OPTIONS } from './field-tables/options';
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
  jamMulai: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format jam mulai harus HH:MM (24 jam).'
  }),
  jamTutup: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format jam tutup harus HH:MM (24 jam).'
  }),
  description: z.string().min(10, {
    message: 'Deskripsi minimal 10 karakter.'
  })
});

export default function FieldForm({
  initialData,
  pageTitle
}: {
  initialData: Field | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    location: initialData?.location || '',
    sport: initialData?.sport || '',
    jamMulai: initialData?.jamMulai || '09:00',
    jamTutup: initialData?.jamTutup || '23:00',
    description: initialData?.description || ''
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
                name='jamMulai'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Mulai</FormLabel>
                    <FormControl>
                      <Input 
                        type='time' 
                        placeholder='Jam Mulai' 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='jamTutup'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Tutup</FormLabel>
                    <FormControl>
                      <Input 
                        type='time' 
                        placeholder='Jam Tutup' 
                        {...field} 
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