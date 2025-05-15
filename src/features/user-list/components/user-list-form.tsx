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
import { User } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  // username: z.string().min(3, {
  //   message: 'Username minimal 3 karakter.'
  // }),
  name: z.string().min(2, {
    message: 'Nama minimal 2 karakter.'
  }),
  email: z.string().email({
    message: 'Email tidak valid.'
  }),
  phone: z.string().regex(/^\+62\s?8\d{9,10}$/, {
    message: 'Nomor telepon harus dimulai dengan +62 8 dan 9-10 digit.'
  })
});

export default function UserForm({
  initialData,
  pageTitle
}: {
  initialData: User | null;
  pageTitle: string;
}) {
  const defaultValues = {
    // username: initialData?.username || '',
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '+62 8'
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
              {/* <FormField
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
              /> */}
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
            </div>
            <Button type='submit'>Simpan User</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}