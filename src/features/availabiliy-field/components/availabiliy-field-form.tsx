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
import { getAvailableTimes } from '@/lib/api/field';
import { createClosedField, updateClosedField, getClosedFieldById } from '@/lib/api/closed';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import type { ClosedFieldResponse } from '@/lib/api/closed';
import Router from 'next/router';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Detail tutup minimal 2 karakter.'
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

// Helper function untuk normalisasi format waktu
const normalizeTimeFormat = (time: string): string => {
  if (time.length === 8 && time.includes(':')) {
    return time.substring(0, 5);
  }
  return time;
};

const toFullTimeFormat = (time: string): string => {
  if (time.length === 5) {
    return `${time}:00`;
  }
  return time;
};

export default function AvailabilityForm({
  initialData,
  pageTitle,
  userId,
  fieldOptions = [],
  editId,
  mode = 'create'
}: {
  initialData: ClosedFieldResponse | null;
  pageTitle: string;
  userId?: number;
  fieldOptions?: { label: string; value: string }[];
  editId?: number;
  mode?: 'create' | 'edit';
}) {
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [editData, setEditData] = useState<ClosedFieldResponse | null>(null);

  const defaultValues = {
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

  useEffect(() => {
    if (mode === 'edit' && editId) {
      loadEditData(editId);
    }
  }, [mode, editId]);

  const loadEditData = async (id: number) => {
    setInitialLoading(true);

    try {
      const result = await getClosedFieldById(id);

      if (result && result.success) {
        let closedFieldData: ClosedFieldResponse | null = null;
        
        if (result.reservation) {
          closedFieldData = result.reservation;
        }
        else if (result.data && result.data.details) {
          closedFieldData = result.data;
        }
        
        if (!closedFieldData || !closedFieldData.details || closedFieldData.details.length === 0) {
          toast('Data tidak ditemukan atau format tidak sesuai');
          return;
        }
        
        form.setValue('name', closedFieldData.name || '');
        const firstDetail = closedFieldData.details[0];
        if (firstDetail) {
          form.setValue('fieldId', firstDetail.fieldId.toString());
          form.setValue('date', firstDetail.date);
        }

        // Extract dan normalisasi time values dari details
        const timeValues = closedFieldData.details
          .filter(detail => detail.time && detail.time.time)
          .map(detail => normalizeTimeFormat(detail.time.time))
          .filter((time, index, array) => array.indexOf(time) === index); // Remove duplicates

        if (timeValues.length > 0) {
          form.setValue('time', timeValues);
        }

        // Store the processed data for later use
        const processedEditData = {
          ...closedFieldData,
          timeValues: timeValues
        };
        setEditData(processedEditData as any);

        if (firstDetail) {
          await fetchAvailableTimes(firstDetail.fieldId.toString(), firstDetail.date, timeValues);
        }

      } else {
        toast(`Error: ${result.message || 'Data tidak ditemukan'}`);
      }
    } catch (error) {
      toast('Terjadi kesalahan saat memuat data');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFieldId && selectedDate) {
      const currentSelectedTimes = mode === 'edit' && editData && (editData as any).timeValues 
        ? (editData as any).timeValues
        : [];
      fetchAvailableTimes(selectedFieldId, selectedDate, currentSelectedTimes);
    } else {
      setAvailableTimes([]);
      if (mode === 'create') {
        form.setValue('time', []);
      }
    }
  }, [selectedFieldId, selectedDate, mode]);

  const fetchAvailableTimes = async (fieldId: string, date: string, preserveTimes: string[] = []) => {
    setLoading(true);
    try {
      const availa = await getAvailableTimes({
        fieldId: Number(fieldId), 
        date,
        excludeClosedId: mode === 'edit' && editId ? editId : undefined
      });
      
      if (availa.success) {
        const times = availa.times || [];
        
        const normalizedTimes = times.map(timeSlot => ({
          ...timeSlot,
          time: normalizeTimeFormat(timeSlot.time)
        }));
        const uniqueTimes = normalizedTimes.reduce((acc, current) => {
          const exists = acc.find(item => item.time === current.time);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, [] as TimeSlot[]);

        if (mode === 'edit' && preserveTimes.length > 0) {
          uniqueTimes.forEach(timeSlot => {
            const normalizedPreserveTimes = preserveTimes.map(t => normalizeTimeFormat(t));
            if (normalizedPreserveTimes.includes(timeSlot.time)) {
              timeSlot.status = 'available';
            }
          });
        }
        
        setAvailableTimes(uniqueTimes);
      } else {
        setAvailableTimes([]);
      }
    } catch (error) {
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimeSelection = (timeValue: string) => {
    // Normalisasi input time value dan semua selected times
    const normalizedTimeValue = normalizeTimeFormat(timeValue);
    const normalizedSelectedTimes = selectedTimes.map(t => normalizeTimeFormat(t));
    
    const newTimes = normalizedSelectedTimes.includes(normalizedTimeValue)
      ? normalizedSelectedTimes.filter(t => t !== normalizedTimeValue)
      : [...normalizedSelectedTimes, normalizedTimeValue].sort();
    
    const uniqueTimes = Array.from(new Set(newTimes));
    
    form.setValue('time', uniqueTimes);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const normalizedTimes = Array.from(new Set(values.time.map(t => normalizeTimeFormat(t))));
    
    const formattedData = {
      userId: userId,
      name: values.name,
      fieldId: Number(values.fieldId),
      date: values.date,
      time: normalizedTimes.map(t => toFullTimeFormat(t)),
    };

    let result;
    if (mode === 'edit' && editId) {
      result = await updateClosedField(editId, formattedData);
    } else {
      result = await createClosedField(formattedData);
    }
    
    if (result.success) {
      toast(mode === 'edit' ? 'Jadwal penutupan lapangan berhasil diperbarui!' : 'Jadwal penutupan lapangan berhasil dibuat!');
      redirect('/dashboard/availability');
    } else {
      toast(`Gagal: ${result.message}`);
    }
  }

  if (initialLoading) {
    return (
      <Card className='mx-auto w-full'>
        <CardHeader>
          <CardTitle className='text-left text-2xl font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p>Memuat data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const normalizedSelectedTimes = Array.from(new Set(selectedTimes.map(t => normalizeTimeFormat(t))));

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
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              
              {/* Lapangan */}
              <FormField
                control={form.control}
                name='fieldId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lapangan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl  className='w-full'>
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
                          {availableTimes.map((timeSlot) => {
                            const normalizedTime = normalizeTimeFormat(timeSlot.time);
                            const isSelected = normalizedSelectedTimes.includes(normalizedTime);
                            
                            return (
                              <Button
                                key={timeSlot.timeId}
                                type='button'
                                variant={isSelected ? 'default' : 'outline'}
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
                                {normalizedTime}
                                {timeSlot.status === 'booked' && (
                                  <span className='ml-1 text-xs'>✗</span>
                                )}
                                {timeSlot.status === 'non-available' && (
                                  <span className='ml-1 text-xs'>-</span>
                                )}
                              </Button>
                            );
                          })}
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
            {normalizedSelectedTimes.length > 0 && selectedDate && selectedFieldId && (
              <div className='rounded-lg border p-4 bg-muted/50'>
                <h3 className='font-semibold mb-2'>Ringkasan Reservasi:</h3>
                <p><strong>Lapangan:</strong> {fieldOptions.find(f => f.value === selectedFieldId)?.label || 'Tidak dipilih'}</p>
                <p><strong>Tanggal:</strong> {selectedDate}</p>
                <p><strong>Waktu Dipilih:</strong> {normalizedSelectedTimes.sort().join(', ')}</p>
                <p><strong>Total Slot:</strong> {normalizedSelectedTimes.length} jam</p>
              </div>
            )}

            
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-red-800 text-red-800 hover:bg-red-100 hover:text-red-800"
                onClick={() => redirect('/dashboard/availability')}
              >
                Batal
              </Button>
              <Button 
                type='submit' 
                className='w-full md:w-auto'
                disabled={normalizedSelectedTimes.length === 0 || loading}
              >
                {loading ? 'Memproses...' : mode === 'edit' ? 'Update Data' : 'Simpan Data'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}