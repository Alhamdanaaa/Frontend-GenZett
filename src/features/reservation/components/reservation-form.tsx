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
import { Reservation } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PAYMENT_STATUS_OPTIONS } from './reservation-tables/options'; 

type PaymentStatus = 'complete' | 'dp' | 'pending' | 'fail';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama pemesan minimal 2 karakter.'
  }),
  fieldData: z.array(
    z.object({
      fieldName: z.string(),
      times: z.array(z.string()),
      dates: z.array(z.string())
    })
  ).optional(),
  totalPayment: z.number().min(0, {
    message: 'Total pembayaran minimal 0.'
  }),
  // remainingPayment: z.number().min(0, {
  //   message: 'Sisa pembayaran minimal 0.'
  // }),
  paymentStatus: z.enum(['pending', 'dp', 'complete', 'fail'] as const, {
    required_error: 'Status pembayaran harus dipilih.'
  }),
});

export default function ReservationForm({
  initialData,
  pageTitle
}: {
  initialData: Reservation | null;
  pageTitle: string;
}) {
  // Ambil data lapangan pertama (jika ada) untuk nilai default form
  const defaultFieldName = initialData?.fieldData && initialData.fieldData.length > 0
    ? initialData.fieldData[0].fieldName
    : '';

  // Ambil tanggal pertama (jika ada) untuk nilai default form
  const defaultDate = initialData?.fieldData && initialData.fieldData.length > 0
    && initialData.fieldData[0].dates.length > 0
    ? initialData.fieldData[0].dates[0]
    : new Date().toISOString().split('T')[0];

  // Pastikan status payment menggunakan tipe yang tepat
  const paymentStatus: PaymentStatus = initialData?.paymentStatus as PaymentStatus || 'pending';

  const defaultValues = {
    name: initialData?.name ?? '',
    fieldData: initialData?.fieldData || [],
    totalPayment: initialData?.total ?? 0,
    // remainingPayment: initialData?.remainingPayment ?? 0,
    paymentStatus: paymentStatus,
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pemesan</FormLabel>
                  <FormControl>
                    <Input placeholder='Masukkan nama pemesan' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {/* Lapangan (menggunakan nilai dari lapangan pertama) */}
              <FormField
                control={form.control}
                name='fieldData'
                render={() => (
                  <FormItem>
                    <FormLabel>Lapangan</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        // Untuk implementasi sederhana, kita hanya update fieldName pada elemen pertama
                        const currentFieldData = [...(form.getValues().fieldData || [])];
                        if (currentFieldData.length === 0) {
                          form.setValue('fieldData', [{ fieldName: value, times: [], dates: [] }]);
                        } else {
                          currentFieldData[0].fieldName = value;
                          form.setValue('fieldData', currentFieldData);
                        }
                      }}
                      value={defaultFieldName}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Pilih lapangan' />
                        </SelectTrigger>
                      </FormControl>
                      {/* <SelectContent>
                        {FIELD_OPTIONS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent> */}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tanggal Main (menggunakan nilai dari tanggal pertama) */}
              <FormField
                control={form.control}
                name='fieldData'
                render={() => (
                  <FormItem>
                    <FormLabel>Tanggal Main</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        placeholder='Pilih tanggal'
                        value={defaultDate}
                        onChange={(e) => {
                          const date = e.target.value;
                          const currentFieldData = [...(form.getValues().fieldData || [])];
                          if (currentFieldData.length === 0) {
                            form.setValue('fieldData', [{ fieldName: '', times: [], dates: [date] }]);
                          } else {
                            currentFieldData[0].dates = [date];
                            form.setValue('fieldData', currentFieldData);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='totalPayment'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Pembayaran</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Masukkan total pembayaran'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name='remainingPayment'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sisa Pembayaran</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Masukkan sisa pembayaran'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name='paymentStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Pembayaran</FormLabel>
                    <Select
                      onValueChange={(value: PaymentStatus) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Pilih status pembayaran' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_STATUS_OPTIONS.map((status) => (
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

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-red-800 text-red-800 hover:bg-red-100 hover:text-red-800"
                onClick={() => window.history.back()}
              >
                Batal
              </Button>
                <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Reservasi'}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}