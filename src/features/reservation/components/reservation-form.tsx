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
import { FIELD_OPTIONS, PAYMENT_STATUS_OPTIONS, RESERVATION_STATUS_OPTIONS } from './reservation-tables/options';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama pemesan minimal 2 karakter.'
  }),
  fieldTime: z.string({
    required_error: 'Lapangan harus dipilih.'
  }),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Tanggal tidak valid.' }
  ),
  totalPayment: z.number().min(0, {
    message: 'Total pembayaran minimal 0.'
  }),
  remainingPayment: z.number().min(0, {
    message: 'Sisa pembayaran minimal 0.'
  }),
  paymentStatus: z.enum(['pending', 'down payment', 'complete', 'fail'], {
    required_error: 'Status pembayaran harus dipilih.'
  }),
  status: z.enum(['upcoming', 'ongoing', 'completed'], {
    required_error: 'Status reservasi harus dipilih.'
  })
});

export default function ReservationForm({
  initialData,
  pageTitle
}: {
  initialData: Reservation | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    fieldTime: initialData?.fieldTime || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    totalPayment: initialData?.totalPayment || 0,
    remainingPayment: initialData?.remainingPayment || 0,
    paymentStatus: initialData?.paymentStatus || 'pending',
    status: initialData?.status || 'upcoming'
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
                    <FormLabel>Nama Pemesan</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan nama pemesan' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fieldTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lapangan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih lapangan' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FIELD_OPTIONS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
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
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Main</FormLabel>
                    <FormControl>
                      <Input 
                        type='date' 
                        placeholder='Pilih tanggal' 
                        {...field} 
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
              <FormField
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
              />
              <FormField
                control={form.control}
                name='paymentStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Pembayaran</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Reservasi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih status reservasi' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RESERVATION_STATUS_OPTIONS.map((status) => (
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
            <Button type='submit'>Simpan Reservasi</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}