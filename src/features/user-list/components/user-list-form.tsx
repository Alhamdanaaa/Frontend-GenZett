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
import { updateUser } from '@/lib/api/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  phone: z.string().regex(/^(\+62|08)\d{8,11}$/, {
    message: 'Nomor telepon harus dimulai dengan +62 atau 08 dan terdiri dari 10-12 digit.'
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
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '08'
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const router = useRouter();
  const isEdit = !!initialData;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Logika untuk menyimpan data user baru atau mengupdate data user yang sudah ada
      if (isEdit && initialData?.id) {
        await updateUser(initialData.id, values);
        console.log('initialData:', initialData);
        toast.success('User berhasil diperbarui');
      } else {
        toast.error('ID user tidak ditemukan atau tidak valid');
      }

      // Redirect kembali ke halaman daftar user
      router.push('/dashboard/user');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan user';
      toast.error(errorMessage);
      console.error('Gagal menyimpan user:', error);
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
                        placeholder='Contoh: 081234567890'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan User'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}