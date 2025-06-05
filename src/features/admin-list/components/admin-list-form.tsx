'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

import { Eye, EyeOff } from 'lucide-react';

import { AdminOutput as Admin } from '@/constants/data';
import { createAdmin, updateAdmin } from '@/lib/api/admin';
import { useLocationsOptions } from './admin-list-tables/options';
import { toast } from 'sonner';

const getFormSchema = (isEdit: boolean) => {
  const baseSchema = {
    name: z.string().min(2, { message: 'Nama minimal 2 karakter.' }),
    email: z.string().email({ message: 'Email tidak valid.' }),
    phone: z.string().regex(/^(\+62|08)\d{8,11}$/, {
      message: 'Nomor telepon harus dimulai dengan +62 atau 08 dan terdiri dari 10-12 digit.'
    }),
    locationId: z.string({ required_error: 'Lokasi harus dipilih.' })
  };

  const passwordSchema = isEdit
    ? {
      password: z.string().optional(),
      password_confirmation: z.string().optional()
    }
    : {
      password: z.string().min(8, { message: 'Password minimal 8 karakter.' }),
      password_confirmation: z.string().min(8, {
        message: 'Konfirmasi password minimal 8 karakter.'
      })
    };

  return z
    .object({
      ...baseSchema,
      ...passwordSchema
    })
    .refine((data) => {
      if (!isEdit || data.password) {
        return data.password === data.password_confirmation;
      }
      return true;
    }, {
      message: 'Password dan konfirmasi password harus sama.',
      path: ['password_confirmation']
    });
};

type FormValues = z.infer<ReturnType<typeof getFormSchema>>;

export default function AdminForm({
  initialData,
  pageTitle
}: {
  initialData: Admin | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const locationOptions = useLocationsOptions();
  const [passwordFilled, setPasswordFilled] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(isEdit)),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '08',
      password: '',
      password_confirmation: '',
      locationId: initialData ? locationOptions.find(loc => loc.label === initialData.location)?.value.toString() || '' : ''
    }
  });

  useEffect(() => {
    if (initialData && locationOptions.length > 0) {
      const matchedLocation = locationOptions.find(
        (loc) => loc.label === initialData.location
      );
      if (matchedLocation) {
        form.setValue('locationId', matchedLocation.value.toString());
      }
    }
  }, [initialData?.location, locationOptions, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && initialData) {
        const updateData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          locationId: parseInt(values.locationId, 10),
          ...(values.password ? {
            password: values.password,
            password_confirmation: values.password_confirmation
          } : {})
        };
        await updateAdmin(initialData.id, updateData);
        toast.success('Admin berhasil diperbarui');
      } else {
        const createData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password!,
          password_confirmation: values.password_confirmation!,
          locationId: parseInt(values.locationId, 10)
        };
        await createAdmin(createData);
        toast.success('Admin berhasil ditambahkan');
      }
      router.push('/dashboard/admin');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan data admin';
      toast.error(errorMessage);
      console.error('Gagal menyimpan data admin:', error);
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>{pageTitle}</CardTitle>
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
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setPasswordFilled(e.target.value.length > 0);
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword((prev) => !prev)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
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
                      <Input type='email' placeholder='Masukkan email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Konfirmasi Password */}
              {(!isEdit || passwordFilled) && (
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password_confirmation">Konfirmasi Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Masukkan konfirmasi password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input type='tel' placeholder='Contoh: 081234567890' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='locationId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Pilih lokasi' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationOptions.map((loc) => (
                          <SelectItem key={loc.value} value={loc.value.toString()}>
                            {loc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-red-800 text-red-800 hover:bg-red-100 hover:text-red-800"
                onClick={() => router.push('/dashboard/admin')}
              >
                Batal
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Admin'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}