'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useSportsOptions, useLocationsOptions } from './membership-tables/options';
import { MembershipWithNames } from '@/constants/data';
import { createMembership, updateMembership } from '@/lib/api/membership';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Skema validasi Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama membership minimal 2 karakter.' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter.' }),
  sports: z.string().nonempty({ message: 'Cabang olahraga wajib dipilih.' }),
  locations: z.string().nonempty({ message: 'Lokasi wajib dipilih.' }),
  discount: z.coerce.number().min(0, { message: 'Diskon tidak boleh negatif.' }),
  weeks: z.coerce.number().min(1, { message: 'Durasi minggu harus diisi.' })
});

type FormValues = z.infer<typeof formSchema>;

export default function MembershipForm({
  initialData,
  pageTitle,
  onSuccess
}: {
  initialData: MembershipWithNames | null;
  pageTitle: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationsOptions = useLocationsOptions();
  const sportsOptions = useSportsOptions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      sports: '',
      locations: '',
      discount: 0,
      weeks: 0,
    },
  });

  useEffect(() => {
    if (!initialData || locationsOptions.length === 0 || sportsOptions.length === 0) return;

    const locationName = initialData.locationName ?? '';
    const sportName = initialData.sportName ?? '';

    const selectedLocation = locationsOptions.find(
      (loc) =>
        typeof loc.label === 'string' &&
        loc.label.toLowerCase() === locationName.toLowerCase()
    );
    const selectedSport = sportsOptions.find(
      (sport) =>
        typeof sport.label === 'string' &&
        sport.label.toLowerCase() === sportName.toLowerCase()
    );

    form.reset({
      name: initialData.name || '',
      description: initialData.description || '',
      sports: selectedSport ? String(selectedSport.value) : '',
      locations: selectedLocation ? String(selectedLocation.value) : '',
      discount: Number(initialData.discount) || 0,
      weeks: initialData.weeks || 0,
    });
  }, [initialData, locationsOptions, sportsOptions, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        description: values.description,
        locationId: Number(values.locations),
        sportId: Number(values.sports),
        discount: values.discount,
        weeks: values.weeks
      };

      if (isEdit && initialData) {
        await updateMembership(initialData.membershipId, payload);
        toast.success("Paket Langganan berhasil diperbarui");
      } else {
        await createMembership(payload);
        toast.success("Paket Langganan berhasil ditambahkan");
      }

      if (onSuccess) onSuccess();
      router.push('/dashboard/membership');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message ?? 'Terjadi kesalahan saat menyimpan paket langganan';
      toast.error(errorMessage);
      console.error('Gagal menyimpan paket langganan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Nama Membership */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Paket Langganan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama paket langganan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deskripsi */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi paket langganan"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              {/* Lokasi */}
              <FormField
                control={form.control}
                name="locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value.toString()}
                        onValueChange={field.onChange}
                        disabled={locationsOptions.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih lokasi">
                            {locationsOptions.find(opt => opt.value === field.value)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {locationsOptions.map((location) => (
                            <SelectItem key={location.value} value={location.value.toString()}>
                              {location.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cabang Olahraga */}
              <FormField
                control={form.control}
                name="sports"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabang Olahraga</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value.toString()}
                        onValueChange={field.onChange}
                        disabled={sportsOptions.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih olahraga">
                            {sportsOptions.find(opt => opt.value === field.value)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {sportsOptions.map((sport) => (
                            <SelectItem key={sport.value} value={sport.value.toString()}>
                              {sport.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Diskon */}
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diskon (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        // step={5}
                        min={0}
                        placeholder="Contoh: 1"
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Durasi Minggu */}
              <FormField
                control={form.control}
                name="weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durasi (Minggu)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Contoh: 1"
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? 0 : parseInt(val, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Membership'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}