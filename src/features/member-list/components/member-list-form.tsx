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
import { Member } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DAY_OPTIONS } from './member-list-tables/options';
import { FIELD_OPTIONS } from '@/features/reservation/components/reservation-tables/options';

const formSchema = z.object({
  username: z.string().min(3, {
    message: 'Username minimal 3 karakter.'
  }),
  nama: z.string().min(2, {
    message: 'Nama minimal 2 karakter.'
  }),
  email: z.string().email({
    message: 'Email tidak valid.'
  }),
  phone: z.string().regex(/^\+62\s?8\d{9,10}$/, {
    message: 'Nomor telepon harus dimulai dengan +62 8 dan 9-10 digit.'
  }),
  day: z.string({
    required_error: 'Hari harus dipilih.'
  }),
  fieldTime: z.string({
    required_error: 'Lapangan dan jam harus dipilih.'
  })
});

export default function MemberForm({
  initialData,
  pageTitle
}: {
  initialData: Member | null;
  pageTitle: string;
}) {
  // Generate default jam (9.00 - 11.00)
  const generateDefaultFieldTime = (field?: string) => {
    const defaultField = field || FIELD_OPTIONS[0];
    return `${defaultField} (09.00 - 11.00)`;
  };

  const defaultValues = {
    username: initialData?.username || '',
    nama: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '+62 8',
    day: initialData?.day || '',
    fieldTime: initialData?.fieldTime || generateDefaultFieldTime()
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
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nama'
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
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type='email'
                        placeholder='Masukkan email' 
                        {...field} 
                      />
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
                name='day'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hari Main</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih hari main' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DAY_OPTIONS.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
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
                name='fieldTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lapangan & Jam</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const startHour = 9;
                        const endHour = 11;
                        field.onChange(`${value} (${startHour}.00 - ${endHour}.00)`);
                      }}
                      value={field.value.split(' (')[0]}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih lapangan' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FIELD_OPTIONS.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Simpan Member</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}