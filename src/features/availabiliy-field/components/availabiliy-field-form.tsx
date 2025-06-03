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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import * as z from 'zod';
import { Reservation } from '@/constants/data';
import { getAvailableTimes } from '@/lib/api/field';
import { createClosedField } from '@/lib/api/closed';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  // userId: z.string().min(1, {
  //   message: 'User ID harus diisi.'
  // }),
  name: z.string().min(2, {
    message: 'Nama minimal 2 karakter.'
  }),
  fieldId: z.string().min(1, {
    message: 'Pilih lapangan terlebih dahulu.'
  }),
  date: z.string().min(1, {
    message: 'Pilih tanggal terlebih dahulu.'
  }),
  time: z.array(z.string()).min(1, {
    message: 'Pilih minimal satu waktu.'
  }),
});

interface TimeSlot {
  timeId: string;
  time: string;
  status: 'available' | 'non-available' | 'booked';
}

export default function ImprovedAvailabilityForm({
  initialData,
  pageTitle,
  userId,
  fieldOptions = [],
  // userOptions = []
}: {
  initialData: Reservation | null;
  pageTitle: string;
  userId?: number;
  fieldOptions?: { label: string; value: string }[];
  // userOptions?: { label: string; value: string }[];
}) {
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    // userId: initialData?.userId ?? '',
    name: initialData?.name ?? '',
    fieldId: '',
    date: new Date().toISOString().split('T')[0],
    time: [],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  const selectedFieldId = form.watch('fieldId');
  const selectedDate = form.watch('date');
  const selectedTimes = form.watch('time') || [];

  // Fetch available times when field or date changes
  useEffect(() => {
    if (selectedFieldId && selectedDate) {
      fetchAvailableTimes(selectedFieldId, selectedDate);
    } else {
      setAvailableTimes([]);
      form.setValue('time', []); // Clear selected times
    }
  }, [selectedFieldId, selectedDate]);

  const fetchAvailableTimes = async (fieldId: string, date: string) => {
    setLoading(true);
    try {
      console.log(fieldId, date);
      // API call untuk mengambil waktu yang tersedia
      const availa = await getAvailableTimes({
        fieldId: Number(fieldId), 
        date
      });
      console.log(availa);
      if (availa.success) {
        setAvailableTimes(availa.times || []);
      } else {
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error('Error fetching available times:', error);
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimeSelection = (timeValue: string) => {
    const currentTimes = selectedTimes;
    const newTimes = currentTimes.includes(timeValue)
      ? currentTimes.filter(t => t !== timeValue)
      : [...currentTimes, timeValue].sort();
    
    form.setValue('time', newTimes);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedData = {
      userId: userId,
      name: values.name,
      fieldId: Number(values.fieldId),
      date: values.date,
      time: values.time
    };
   
    console.log('Form submitted:', formattedData);

    // try {
      const result = await createClosedField(formattedData);
      console.log(result);
      if (result.success) {
        toast('Reservasi berhasil dibuat!');
        // Tambahkan navigasi atau reset form jika perlu
        redirect('/dashboard/availability');
      } else {
        toast(`Gagal: ${result.message}`);
      }
    // } catch (error) {
    //   console.error('Error saat membuat reservasi:', error);
    //   toast('Terjadi kesalahan saat menyimpan data');
    // }
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
              {/* Detail tutup */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detail tutup</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan detail tutup' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Lapangan */}
              <FormField
                control={form.control}
                name='fieldId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lapangan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih lapangan' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fieldOptions && fieldOptions.length > 0 ? (
                          fieldOptions.map((fieldOption) => (
                            <SelectItem key={fieldOption.value} value={fieldOption.value}>
                              {fieldOption.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            Tidak ada lapangan tersedia
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tanggal */}
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Tutup</FormLabel>
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
            </div>

            {/* Dynamic Time Selection */}
            <FormField
              control={form.control}
              name='time'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Waktu Tersedia</FormLabel>
                  <FormControl>
                    <div className='space-y-4'>
                      {loading ? (
                        <div className='text-center py-4'>
                          <p>Memuat waktu tersedia...</p>
                        </div>
                      ) : availableTimes.length > 0 ? (
                        <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
                          {availableTimes.map((timeSlot) => (
                            <Button
                              key={timeSlot.timeId}
                              type='button'
                              variant={selectedTimes.includes(timeSlot.time) ? 'default' : 'outline'}
                              size='sm'
                              disabled={timeSlot.status !== 'available'}
                              onClick={() => toggleTimeSelection(timeSlot.time)}
                              className={`w-full ${
                                timeSlot.status === 'booked' 
                                  ? 'bg-destructive/20 text-destructive border-destructive/50' 
                                  : timeSlot.status === 'non-available'
                                  ? 'bg-muted text-muted-foreground'
                                  : ''
                              }`}
                            >
                              {timeSlot.time}
                              {timeSlot.status === 'booked' && (
                                <span className='ml-1 text-xs'>✗</span>
                              )}
                              {timeSlot.status === 'non-available' && (
                                <span className='ml-1 text-xs'>-</span>
                              )}
                            </Button>
                          ))}
                        </div>
                      ) : selectedFieldId && selectedDate ? (
                        <div className='text-center py-4 text-muted-foreground'>
                          <p>Tidak ada waktu tersedia untuk lapangan dan tanggal yang dipilih</p>
                        </div>
                      ) : (
                        <div className='text-center py-4 text-muted-foreground'>
                          <p>Pilih lapangan dan tanggal terlebih dahulu</p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <div className='text-xs text-muted-foreground mt-2'>
                    <p>Status: Hijau = Tersedia, Abu = Tidak Tersedia, Merah = Sudah Dipesan</p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Summary */}
            {selectedTimes.length > 0 && selectedDate && selectedFieldId && (
              <div className='rounded-lg border p-4 bg-muted/50'>
                <h3 className='font-semibold mb-2'>Ringkasan Reservasi:</h3>
                <p><strong>Lapangan:</strong> {fieldOptions.find(f => f.value === selectedFieldId)?.label || 'Tidak dipilih'}</p>
                <p><strong>Tanggal:</strong> {selectedDate}</p>
                <p><strong>Waktu Dipilih:</strong> {selectedTimes.join(', ')}</p>
                <p><strong>Total Slot:</strong> {selectedTimes.length} jam</p>
              </div>
            )}

            <Button 
              type='submit' 
              className='w-full md:w-auto'
              disabled={selectedTimes.length === 0 || loading}
            >
              {loading ? 'Memproses...' : 'Simpan Reservasi'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}