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
import { Sport } from '@/constants/data';
import { useRouter } from 'next/navigation';
import { createSport, updateSport } from '@/lib/api/sports';

const formSchema = z.object({
  sportName: z.string().min(2, {
    message: 'Nama olahraga minimal 2 karakter.'
  }),
  description: z.string().min(10, {
    message: 'Deskripsi minimal 10 karakter.'
  })
});

export default function SportForm({
  initialData,
  pageTitle
}: {
  initialData: Sport | null;
  pageTitle: string;
}) {
  const defaultValues = {
    sportName: initialData?.sportName || '',
    description: initialData?.description || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const router = useRouter();
  const isEdit = !!initialData;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit) {
        await updateSport(initialData!.sportId, values);
      } else {
        const res = await createSport(values);
        router.push(`/sports/${res.sport.sportId}`);
      }

      // Redirect kembali ke halaman daftar olahraga
      router.push('/dashboard/sport');
    } catch (error) {
      console.error('Gagal menyimpan olahraga:', error);
      // Tambahkan penanganan error atau toast di sini jika mau
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
            <FormField
              control={form.control}
              name='sportName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Olahraga</FormLabel>
                  <FormControl>
                    <Input placeholder='Masukkan nama olahraga' {...field} />
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
                      placeholder='Masukkan deskripsi olahraga'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-red-800 text-red-800 hover:bg-red-100 hover:text-red-800"
                onClick={() => router.push('/dashboard/sport')}
              >
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Olahraga'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
