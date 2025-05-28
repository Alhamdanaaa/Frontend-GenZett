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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Clock, AlertTriangle } from 'lucide-react';
import { Field } from '@/constants/data';
import { createField, updateField } from '@/lib/api/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';

// Schema untuk time slot pricing
const timeSlotSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format jam harus HH:MM (24 jam).'
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format jam harus HH:MM (24 jam).'
  }),
  price: z.number().min(1000, {
    message: 'Harga minimal Rp 1.000.'
  })
});

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Nama lapangan minimal 2 karakter.'
  }),
  location: z.string({
    required_error: 'Lokasi harus dipilih.'
  }),
  sport: z.string({
    required_error: 'Cabang olahraga harus dipilih.'
  }),
  startHour: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format jam mulai harus HH:MM (24 jam).'
  }),
  endHour: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format jam tutup harus HH:MM (24 jam).'
  }),
  description: z.string().min(10, {
    message: 'Deskripsi minimal 10 karakter.'
  }),
  // Pricing configuration
  pricingType: z.enum(['fixed', 'time_based'], {
    required_error: 'Tipe pricing harus dipilih.'
  }),
  fixedPrice: z.number().optional(),
  timeSlots: z.array(timeSlotSchema).optional(),
  // Overlap handling
  overlapStrategy: z.enum(['highest', 'lowest', 'priority'], {
    required_error: 'Strategi overlap harus dipilih.'
  }).optional(),
  defaultPrice: z.number().min(1000, {
    message: 'Harga default minimal Rp 1.000.'
  }).optional()
}).refine((data) => {
  if (data.pricingType === 'fixed') {
    return data.fixedPrice && data.fixedPrice >= 1000;
  }
  if (data.pricingType === 'time_based') {
    return data.timeSlots && data.timeSlots.length > 0 && data.overlapStrategy && data.defaultPrice;
  }
  return true;
}, {
  message: 'Konfigurasi harga tidak valid.',
  path: ['pricingType']
});

type FormData = z.infer<typeof formSchema>;

function formatCurrency(amount: number | string) {
  if (typeof amount !== "number") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function FieldForm({
  initialData,
  pageTitle,
  locationOptions,
  sportOptions,
}: {
  initialData: Field | null;
  pageTitle: string;
  locationOptions: { value: string; label: string }[];
  sportOptions: { value: string; label: string }[];
}) {
  const defaultValues: FormData = {
    name: initialData?.name ?? '',
    location: initialData?.location ? String(initialData.location) : '',
    sport: initialData?.sport ? String(initialData.sport) : '',
    startHour: initialData?.startHour?.slice(0, 5) ?? '08:00',
    endHour: initialData?.endHour?.slice(0, 5) ?? '23:00',
    description: initialData?.description ?? '',
    pricingType: 'fixed',
    fixedPrice: 50000,
    timeSlots: [
      { startTime: '08:00', endTime: '17:00', price: 50000},
      { startTime: '17:00', endTime: '23:00', price: 75000}
    ],
    overlapStrategy: 'highest',
    defaultPrice: 40000
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'timeSlots'
  });

  const router = useRouter();
  const pricingType = form.watch('pricingType');

  // Helper function to detect overlaps and gaps
  const analyzeTimeSlots = () => {
    const slots = form.getValues('timeSlots') || [];
    const fieldStart = form.getValues('startHour');
    const fieldEnd = form.getValues('endHour');
    
    if (!slots.length || !fieldStart || !fieldEnd) return { overlaps: [], gaps: [] };

    // Convert time to minutes for easier calculation
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const fieldStartMinutes = timeToMinutes(fieldStart);
    const fieldEndMinutes = timeToMinutes(fieldEnd);

    // Sort slots by start time
    const sortedSlots = [...slots].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    // Find overlaps
    const overlaps = [];
    for (let i = 0; i < sortedSlots.length; i++) {
      for (let j = i + 1; j < sortedSlots.length; j++) {
        const slot1Start = timeToMinutes(sortedSlots[i].startTime);
        const slot1End = timeToMinutes(sortedSlots[i].endTime);
        const slot2Start = timeToMinutes(sortedSlots[j].startTime);
        const slot2End = timeToMinutes(sortedSlots[j].endTime);

        if (slot1End > slot2Start && slot1Start < slot2End) {
          const overlapStart = Math.max(slot1Start, slot2Start);
          const overlapEnd = Math.min(slot1End, slot2End);
          overlaps.push({
            time: `${minutesToTime(overlapStart)}-${minutesToTime(overlapEnd)}`,
            slots: [
              { ...sortedSlots[i], index: i },
              { ...sortedSlots[j], index: j }
            ]
          });
        }
      }
    }

    // Find gaps
    const gaps = [];
    let currentTime = fieldStartMinutes;

    for (const slot of sortedSlots) {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);

      // Skip slots that are outside field hours
      if (slotEnd <= fieldStartMinutes || slotStart >= fieldEndMinutes) continue;

      // Adjust slot boundaries to field hours
      const adjustedStart = Math.max(slotStart, fieldStartMinutes);
      const adjustedEnd = Math.min(slotEnd, fieldEndMinutes);

      if (currentTime < adjustedStart) {
        gaps.push({
          time: `${minutesToTime(currentTime)}-${minutesToTime(adjustedStart)}`,
          duration: adjustedStart - currentTime
        });
      }

      currentTime = Math.max(currentTime, adjustedEnd);
    }

    // Check for gap at the end
    if (currentTime < fieldEndMinutes) {
      gaps.push({
        time: `${minutesToTime(currentTime)}-${minutesToTime(fieldEndMinutes)}`,
        duration: fieldEndMinutes - currentTime
      });
    }

    return { overlaps, gaps };
  };

  const { overlaps, gaps } = analyzeTimeSlots();

  // Function to fill gaps with lowest price - now inside component scope
  const fillGapsWithLowestPrice = () => {
    const currentSlots = form.getValues('timeSlots') || [];
    
    // Cari harga terendah dari slot yang sudah ada
    const getLowestPrice = () => {
      if (currentSlots.length === 0) return 40000; // fallback jika belum ada slot
      
      const prices = currentSlots.map((slot: { price: number }) => slot.price);
      return Math.min(...prices);
    };
    
    const lowestPrice = getLowestPrice();
    
    // Isi semua gap dengan harga terendah
    gaps.forEach((gap: { time: string }) => {
      const [start, end] = gap.time.split('-');
      currentSlots.push({
        startTime: start,
        endTime: end,
        price: lowestPrice
      });
    });

    // Update form dengan slot yang sudah ditambahkan
    form.setValue('timeSlots', currentSlots);
    
    // Optional: Show notification/feedback
    console.log(`Gap terisi dengan harga terendah: ${formatCurrency(lowestPrice)}`);
  };

  // Predefined time slot templates
  const timeSlotTemplates = [
    {
      name: 'Siang-Malam (2 Slot)',
      slots: [
        { startTime: '08:00', endTime: '17:00', price: 50000 },
        { startTime: '17:00', endTime: '23:00', price: 75000 }
      ]
    },
    {
      name: 'Pagi-Siang-Malam (3 Slot)',
      slots: [
        { startTime: '06:00', endTime: '12:00', price: 40000 },
        { startTime: '12:00', endTime: '18:00', price: 60000 },
        { startTime: '18:00', endTime: '23:00', price: 80000 }
      ]
    },
    {
      name: 'Peak Hours (4 Slot)',
      slots: [
        { startTime: '06:00', endTime: '10:00', price: 45000 },
        { startTime: '10:00', endTime: '16:00', price: 35000 },
        { startTime: '16:00', endTime: '20:00', price: 75000 },
        { startTime: '20:00', endTime: '23:00', price: 60000 }
      ]
    }
  ];

  const applyTemplate = (template: typeof timeSlotTemplates[0]) => {
    form.setValue('timeSlots', template.slots);
  };

  const addTimeSlot = () => {
    const lastSlot = fields[fields.length - 1];
    const startTime = lastSlot ? lastSlot.endTime : '08:00';
    
    append({
      startTime,
      endTime: '23:00',
      price: 50000
    });
  };

  async function onSubmit(values: FormData) {
    console.log('Form submitted:', values);
    try {
      if (initialData) {
        await updateField(initialData.id, values);
      } else {
        await createField(values);
      }
      
      router.push('/dashboard/field');
    } catch (error) {
      console.error('Gagal menyimpan lapangan:', error);
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
            {/* Basic Information */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lapangan</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan nama lapangan' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih lokasi' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationOptions.map((location) => (
                          <SelectItem key={location.value} value={location.value}>
                            {location.label}
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
                name='sport'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabang Olahraga</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih cabang olahraga' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sportOptions.map((sport) => (
                          <SelectItem key={sport.value} value={sport.value}>
                            {sport.label}
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
                name='startHour'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Mulai</FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        step={3600}
                        placeholder='Jam Mulai'
                        {...field}
                        onChange={(e) => {
                          const time = e.target.value;
                          const [hour] = time.split(':');
                          const fixedTime = `${hour}:00`;
                          field.onChange(fixedTime);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endHour'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Tutup</FormLabel>
                    <FormControl>
                      <Input
                        type='time'
                        step={3600}
                        placeholder='Jam Tutup'
                        {...field}
                        onChange={(e) => {
                          const time = e.target.value;
                          const [hour] = time.split(':');
                          const fixedTime = `${hour}:00`;
                          field.onChange(fixedTime);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan deskripsi lapangan'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pricing Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5' />
                  Konfigurasi Harga
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <FormField
                  control={form.control}
                  name='pricingType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Harga</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Pilih tipe harga' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='fixed'>Harga Tetap</SelectItem>
                          <SelectItem value='time_based'>Berdasarkan Waktu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {pricingType === 'fixed' && (
                  <FormField
                    control={form.control}
                    name='fixedPrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga per Jam</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='50000'
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {pricingType === 'time_based' && (
                  <div className='space-y-4'>
                    {/* Overlap Strategy */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='overlapStrategy'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strategi Overlap Waktu</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Pilih strategi' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='highest'>Ambil Harga Tertinggi</SelectItem>
                                <SelectItem value='lowest'>Ambil Harga Terendah</SelectItem>
                                <SelectItem value='priority'>Berdasarkan Prioritas (Urutan)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name='defaultPrice'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Harga Default (untuk jam kosong)</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='40000'
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Conflict & Gap Analysis */}
                    {(overlaps.length > 0 || gaps.length > 0) && (
                      <Card className='border-amber-200 bg-amber-50'>
                        <CardHeader className='pb-3'>
                          <CardTitle className='text-amber-800 text-lg'>⚠️ Analisis Konflik Waktu</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                          {overlaps.length > 0 && (
                            <div>
                              <h5 className='font-medium text-amber-800 mb-2'>🔄 Overlap Terdeteksi:</h5>
                              {overlaps.map((overlap, index) => (
                                <div key={index} className='bg-white p-3 rounded border border-amber-200 mb-2'>
                                  <div className='font-medium text-amber-900'>Jam {overlap.time}</div>
                                  <div className='text-sm text-amber-700 mt-1'>
                                    Konflik antara:
                                    {overlap.slots.map((slot: any, i: number) => (
                                      <div key={i} className='ml-2'>
                                        • {slot.startTime}-{slot.endTime}: {formatCurrency(slot.price)} {slot.label && `(${slot.label})`}
                                      </div>
                                    ))}
                                  </div>
                                  <div className='text-xs text-amber-600 mt-2'>
                                    Akan menggunakan strategi: <strong>{form.watch('overlapStrategy') === 'highest' ? 'Harga Tertinggi' : form.watch('overlapStrategy') === 'lowest' ? 'Harga Terendah' : 'Prioritas Urutan'}</strong>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {gaps.length > 0 && (
                            <div>
                              <div className='flex items-center justify-between mb-2'>
                                <h5 className='font-medium text-amber-800'>⏰ Jam Kosong:</h5>
                                <Button
                                  type='button'
                                  size='sm'
                                  variant='outline'
                                  onClick={fillGapsWithLowestPrice}
                                  className='border-amber-300 text-amber-700 hover:bg-amber-100'
                                >
                                  Isi Otomatis
                                </Button>
                              </div>
                              {gaps.map((gap: any, index: number) => (
                                <div key={index} className='bg-white p-2 rounded border border-amber-200 mb-1'>
                                  <span className='text-amber-900'>{gap.time}</span>
                                  <span className='text-xs text-amber-600 ml-2'>
                                    ({Math.floor(gap.duration / 60)}h {gap.duration % 60}m) → Akan menggunakan harga default: {formatCurrency(form.watch('defaultPrice') || 40000)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium'>Template Cepat</h4>
                      <div className='flex gap-2 flex-wrap'>
                        {timeSlotTemplates.map((template, index) => (
                          <Button
                            key={index}
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => applyTemplate(template)}
                          >
                            {template.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className='space-y-4'>
                      {fields.map((field, index) => (
                        <Card key={field.id} className='p-4'>
                          <div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-end'>
                            <FormField
                              control={form.control}
                              name={`timeSlots.${index}.startTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Jam Mulai</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type='time'
                                      step={3600}
                                      placeholder='Jam Mulai'
                                      {...field}
                                      onChange={(e) => {
                                        const time = e.target.value;
                                        const [hour] = time.split(':');
                                        const fixedTime = `${hour}:00`;
                                        field.onChange(fixedTime);
                                      }} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`timeSlots.${index}.endTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Jam Selesai</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type='time'
                                      step={3600}
                                      placeholder='Jam Selesai'
                                      {...field}
                                      onChange={(e) => {
                                        const time = e.target.value;
                                        const [hour] = time.split(':');
                                        const fixedTime = `${hour}:00`;
                                        field.onChange(fixedTime);
                                      }} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`timeSlots.${index}.price`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Harga per Jam</FormLabel>
                                  <FormControl>
                                    <Input
                                      type='number'
                                      placeholder='50000'
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type='button'
                              variant='outline'
                              size='icon'
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                          {form.watch(`timeSlots.${index}.price`) && (
                            <div className='mt-2'>
                              <Badge variant='secondary'>
                                {form.watch(`timeSlots.${index}.startTime`)} - {form.watch(`timeSlots.${index}.endTime`)}: {formatCurrency(form.watch(`timeSlots.${index}.price`))}
                              </Badge>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>

                    <Button
                      type='button'
                      variant='outline'
                      onClick={addTimeSlot}
                      className='w-full'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Tambah Slot Waktu
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Demo Section */}
            {/* {pricingType === 'time_based' && (
              <Card className='border-blue-200 bg-blue-50'>
                <CardHeader>
                  <CardTitle className='text-blue-800 flex items-center gap-2'>
                    🎯 Demo Kasus Overlap
                    <Button
                      type='button'
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        form.setValue('timeSlots', [
                          { startTime: '07:00', endTime: '15:00', price: 150000 },
                          { startTime: '13:00', endTime: '23:00', price: 200000 }
                        ]);
                      }}
                      className='border-blue-300 text-blue-700'
                    >
                      Coba Kasus Anda
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-blue-700 mb-3'>
                    <strong>Contoh kasus:</strong> Jam 07-15 harga 150k, jam 13-23 harga 200k.
                    Pada jam 13-15 terjadi overlap, sistem akan otomatis menangani sesuai strategi yang dipilih.
                  </p>
                  
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-xs'>
                    <div className='bg-white p-2 rounded border'>
                      <div className='font-medium text-blue-900'>Harga Tertinggi</div>
                      <div className='text-blue-700'>Jam 13-15 = Rp 200.000</div>
                    </div>
                    <div className='bg-white p-2 rounded border'>
                      <div className='font-medium text-blue-900'>Harga Terendah</div>
                      <div className='text-blue-700'>Jam 13-15 = Rp 150.000</div>
                    </div>
                    <div className='bg-white p-2 rounded border'>
                      <div className='font-medium text-blue-900'>Prioritas</div>
                      <div className='text-blue-700'>Jam 13-15 = Slot pertama (150k)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )} */}

            <Button type='submit' className='w-full'>
              Simpan Lapangan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}