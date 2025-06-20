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
import { Trash2, Plus, Clock } from 'lucide-react';
import { Field } from '@/constants/data';
import { createField, updateField } from '@/lib/api/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { IconAlertCircle } from '@tabler/icons-react';
import { toast } from 'sonner';

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
  locationId: z.string().optional(), // Made optional for admin users
  sportId: z.number({
    required_error: 'Cabang olahraga harus dipilih.'
  }),
  description: z.string().min(10, {
    message: 'Deskripsi minimal 10 karakter.'
  }),
  // Pricing configuration
  pricingType: z.enum(['fixed', 'time_based'], {
    required_error: 'Tipe pricing harus dipilih.'
  }),
  // Fixed pricing fields (only required when pricingType is 'fixed')
  fixedPrice: z.number().optional(),
  startHour: z.string().optional(),
  endHour: z.string().optional(),
  // Time-based pricing fields
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
    return data.fixedPrice && data.fixedPrice >= 1000 && data.startHour && data.endHour;
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

// API Data format interface
interface ApiFieldData {
  locationId: string;
  sportId: number;
  name: string;
  startHour: string;
  endHour: string;
  description: string;
  start: string[];
  end: string[];
  price: number[];
}

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
  userRole,
  userLocationId,
}: {
  initialData: Field | null;
  pageTitle: string;
  locationOptions: { value: string; label: string }[];
  sportOptions: { value: string; label: string }[];
  userRole?: string;
  userLocationId?: string | null;
}) {
  const convertApiToFormData = (data: any) => {
    if (!data) return null;

    const timeSlots = [];
    if (data.start && data.end && data.price) {
      for (let i = 0; i < data.start.length; i++) {
        timeSlots.push({
          startTime: data.start[i],
          endTime: data.end[i],
          price: data.price[i]
        });
      }
    }

    return {
      ...data,
      locationId: String(data.locationId || data.location),
      sportId: Number(data.sportId || data.sport),
      timeSlots,
      pricingType: timeSlots.length > 0 ? 'time_based' : 'fixed'
    };
  };

  const convertedInitialData = convertApiToFormData(initialData);

  const defaultValues: FormData = {
    name: convertedInitialData?.name ?? '',
    locationId: convertedInitialData?.locationId ?? (userRole === 'admin' ? userLocationId : undefined),
    sportId: convertedInitialData?.sportId ?? undefined,
    description: convertedInitialData?.description ?? '',
    pricingType: convertedInitialData?.pricingType ?? undefined,
    // Fixed pricing defaults
    fixedPrice: convertedInitialData?.fixedPrice ?? 50000,
    startHour: convertedInitialData?.startHour?.slice(0, 5) ?? '08:00',
    endHour: convertedInitialData?.endHour?.slice(0, 5) ?? '23:00',
    // Time-based pricing defaults
    timeSlots: convertedInitialData?.timeSlots ?? [
      { startTime: '08:00', endTime: '17:00', price: 50000 },
      { startTime: '17:00', endTime: '23:00', price: 75000 }
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

  // Convert form data to API format
  const convertFormToApiData = (formData: FormData): ApiFieldData => {
    const baseData = {
      locationId: formData.locationId || (userRole === 'admin' ? userLocationId! : ''),
      sportId: formData.sportId,
      name: formData.name,
      startHour: '',
      endHour: '',
      description: formData.description,
      start: [] as string[],
      end: [] as string[],
      price: [] as number[]
    };

    if (formData.pricingType === 'fixed' && formData.fixedPrice && formData.startHour && formData.endHour) {
      // For fixed pricing, use the form's startHour and endHour
      baseData.startHour = formData.startHour;
      baseData.endHour = formData.endHour;
      baseData.start = [formData.startHour];
      baseData.end = [formData.endHour];
      baseData.price = [formData.fixedPrice];
    } else if (formData.pricingType === 'time_based' && formData.timeSlots) {
      // For time-based pricing, calculate overall operating hours from time slots
      const sortedSlots = [...formData.timeSlots].sort((a, b) => a.startTime.localeCompare(b.startTime));
      baseData.startHour = sortedSlots[0]?.startTime || '08:00';
      baseData.endHour = sortedSlots[sortedSlots.length - 1]?.endTime || '23:00';
      
      // Convert timeSlots array to separate arrays
      formData.timeSlots.forEach(slot => {
        baseData.start.push(slot.startTime);
        baseData.end.push(slot.endTime);
        baseData.price.push(slot.price);
      });
    }

    return baseData;
  };

  // Helper function to detect overlaps and gaps (only for time-based pricing)
  const analyzeTimeSlots = () => {
    if (pricingType !== 'time_based') return { overlaps: [], gaps: [] };
    
    const slots = form.getValues('timeSlots') || [];
    if (!slots.length) return { overlaps: [], gaps: [] };

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

    // For time-based pricing, we don't need to check for gaps against fixed field hours
    // since each time slot defines its own operating hours
    const gaps: any[] = [];

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
      const apiData = convertFormToApiData(values);
      console.log('API Data:', apiData);

      if (initialData) {
        await updateField(initialData.id, apiData);
        toast.success('Lapangan berhasil diperbarui!');
      } else {
        await createField(apiData);
        toast.success('Lapangan berhasil ditambahkan!');
      }
      router.push('/dashboard/field');
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan lapangan.');
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

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Location field - only show for superadmin */}
              {userRole === 'superadmin' && (
                <FormField
                  control={form.control}
                  name="locationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi Cabang</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value != null ? String(field.value) : undefined}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Lokasi Cabang" />
                          </SelectTrigger>
                          <SelectContent>
                            {locationOptions.map((location) => (
                              <SelectItem
                                key={location.value}
                                value={location.value}
                              >
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
              )}
              
              <FormField
                control={form.control}
                name='sportId'
                render={({ field }) => (
                  <FormItem className={userRole === 'admin' ? 'md:col-span-2' : ''}>
                    <FormLabel>Cabang Olahraga</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value != null ? String(field.value) : undefined}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih cabang olahraga" />
                        </SelectTrigger>
                        <SelectContent>
                          {sportOptions.map((sport) => (
                            <SelectItem key={sport.value} value={sport.value}>
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
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Pilih Tipe Harga' />
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

                {/* Fixed Pricing Configuration */}
                {pricingType === 'fixed' && (
                  <Card className='border-blue-200 bg-blue-50'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-blue-800 text-lg'>🕐 Konfigurasi Harga Tetap</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
                                  placeholder='08:00'
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
                                  placeholder='23:00'
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
                      {form.watch('fixedPrice') && form.watch('startHour') && form.watch('endHour') && (
                        <div className='bg-white p-3 rounded border border-blue-200'>
                          <Badge variant='secondary' className='text-blue-800'>
                            Operasional: {form.watch('startHour')} - {form.watch('endHour')} | Harga: {formatCurrency(form.watch('fixedPrice')!)} per jam
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Time-based Pricing Configuration */}
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
                                <SelectTrigger className='w-full'>
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

                    {/* Conflict Analysis */}
                    {overlaps.length > 0 && (
                      <Card className='border-amber-200 bg-amber-50'>
                        <CardHeader className='pb-3'>
                          <CardTitle className='text-amber-800 text-lg'>⚠️ Analisis Konflik Waktu</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                          <div>
                            <div className='flex items-center gap-2 mb-2'>
                              <IconAlertCircle className="h-5 w-5 text-amber-800" />
                              <h5 className='font-medium text-amber-800 mr-auto'>Overlap Terdeteksi:</h5>
                            </div>
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
                          <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-end'>
                            <FormField
                              control={form.control}
                              name={`timeSlots.${index}.startTime`}
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
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
                                <FormItem className="md:col-span-2">
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
                                <FormItem className="md:col-span-7">
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
                            <div className="md:col-span-1 flex justify-center">
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

            <div className="my-2 space-y-2">
              <Button type='submit' className='w-full'>
                Simpan Lapangan
              </Button>

              <div className="border-t border-gray-300"></div>

              <Button
                type="button"
                variant="outline"
                className="border-red-800 text-red-800 hover:bg-red-100 hover:text-red-800 w-full"
                onClick={() => router.push('/dashboard/field')}
              >
                Batal
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}