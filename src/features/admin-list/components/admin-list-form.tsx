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
import { Admin } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Daftar lokasi
const LOCATION_OPTIONS = [
  { label: 'GOR Utama', value: 'GOR Utama' },
  { label: 'Sport Center Kota', value: 'Sport Center Kota' },
  { label: 'Stadion Olahraga', value: 'Stadion Olahraga' },
  { label: 'Pusat Kebugaran', value: 'Pusat Kebugaran' },
  { label: 'Arena Olahraga', value: 'Arena Olahraga' },
  { label: 'Kompleks Olahraga', value: 'Kompleks Olahraga' },
  { label: 'Lapangan Terpadu', value: 'Lapangan Terpadu' }
];

// Opsi status akun
const ACCOUNT_STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Suspended', value: 'Suspended' }
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama minimal 2 karakter.'
  }),
  phone: z.string().regex(/^\+62\s?8\d{9,10}$/, {
    message: 'Nomor telepon harus dimulai dengan +62 8 dan 9-10 digit.'
  }),
  location: z.string({
    required_error: 'Lokasi harus dipilih.'
  }),
  accountStatus: z.enum(['Active', 'Inactive', 'Suspended'], {
    required_error: 'Status akun harus dipilih.'
  })
});

export default function AdminForm({
  initialData,
  pageTitle
}: {
  initialData: Admin | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    phone: initialData?.phone || '+62 8',
    location: initialData?.location || '',
    accountStatus: initialData?.accountStatus || 'Active'
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
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan nama lengkap' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input 
                        type='tel'
                        placeholder='Contoh: +62 8123456789' 
                        {...field} 
                      />
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
                name='accountStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Akun</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih status akun' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCOUNT_STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Simpan Admin</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}