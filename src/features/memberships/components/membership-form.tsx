import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import { Membership } from '@/constants/data';
import { createMembership } from '@/lib/api/membership'; // Pastikan path ini benar

// Schema validasi dengan zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Nama membership minimal 2 karakter.' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter.' }),
  // locations dan sports berupa string, karena dari Select single pilihan
  sports: z.string().nonempty({ message: 'Cabang olahraga wajib dipilih.' }),
  locations: z.string().nonempty({ message: 'Lokasi wajib dipilih.' }),
  discount: z.coerce.number().min(0, { message: 'Diskon tidak boleh negatif.' }),
  weeks: z.coerce.number().min(1, { message: 'Durasi minggu harus diisi.' })
});

export default function MembershipForm({
  initialData,
  pageTitle,
  onSuccess
}: {
  initialData: Membership | null;
  pageTitle: string;
  onSuccess?: () => void;
}) {
  const sportsOptions = useSportsOptions();
  const locationsOptions = useLocationsOptions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      locations: initialData?.locationId?.toString() ?? '', // pastikan ini string ID
      sports: initialData?.sportId?.toString() ?? '',
      discount: initialData?.discount ?? 0,
      weeks: initialData?.weeks ?? 1
    },
    mode: 'onBlur'
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Payload harus sesuai tipe data backend: lokasi dan olahraga sebagai number ID
      const payload = {
        name: values.name,
        description: values.description,
        locationId: Number(values.locations),
        sportId: Number(values.sports),
        discount: values.discount,
        weeks: values.weeks
      };

      console.log('Payload to submit:', payload);

      await createMembership(payload);

      if (onSuccess) onSuccess();
      form.reset();
    } catch (error: any) {
      // Tangani error dengan log pesan error dari backend bila ada
      if (error.response?.data) {
        console.error('Error submitting membership:', error.response.data);
      } else {
        console.error('Error submitting membership:', error.message);
      }
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
                  <FormLabel>Nama Membership</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama membership" {...field} />
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
                      placeholder="Masukkan deskripsi membership"
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
                          <SelectValue placeholder={locationsOptions.length === 0 ? 'Loading...' : 'Pilih lokasi'} />
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
                          <SelectValue placeholder={sportsOptions.length === 0 ? 'Loading...' : 'Pilih olahraga'} />
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
                    <FormLabel>Diskon</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="5"
                        min={0}
                        placeholder="Contoh: 10"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          field.onChange(value);
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
                        min={1}
                        placeholder="Contoh: 4 minggu"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
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
