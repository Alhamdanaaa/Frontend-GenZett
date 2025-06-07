/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { ChevronDownCircle } from 'lucide-react';
import UserLayout from '@/app/user/layout';
import { getSportsByLocation, getSchedule } from '@/lib/api/reservation';
import { useSearchParams, useRouter } from 'next/navigation';
import { Membership } from '@/constants/data';
import { getMembershipById } from '@/lib/api/membership';

type TimeSlot = {
  date: string;
  time: string;
  timeId: string;
  court: string;
  fieldId: string;
  price: number;
};

type PaymentData = {
  bookings: Array<{
    date: string;
    field: string;
    fieldId: string;
    times: string[];
    timeIds: string[];
    price: number;
  }>;
  locationId: string;
  paymentType: 'reguler' | 'membership';
  userId: string;
  subtotal: number;
  discount: number;
  total: number;
  membershipId?: string;
};

export default function SchedulesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scheduleRef = useRef<HTMLDivElement>(null);

  const locationId = searchParams.get('locationId');
  const sportName = searchParams.get('sportName');
  const membershipId = searchParams.get('membershipId');

  const [openDropdown, setOpenDropdown] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>(''); // format: 'YYYY-MM-DD'
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>(membershipId ? 'Membership' : 'Reguler');

  const [sports, setSports] = useState<Array<{ sportId: string, sportName: string }>>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [dates, setDates] = useState<Array<{ day: string; date: string; month: string; displayDate: string }>>([]);
  const [timeSlotsByCourt, setTimeSlotsByCourt] = useState<Record<string, any[]>>({});
  const [courts, setCourts] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [membershipData, setMembershipsData] = useState<Membership | null>(null);
  // const [membershipBooking, setMembershipsBooking] = useState<Array<{TimeSlot}>>([]);
  const [recurringWeeks, setRecurringWeeks] = useState<number[]>([]);

  const getDayName = (dayIndex: number): string => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
    return days[dayIndex];
  };

  const getMonthName = (monthIndex: number): string => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return months[monthIndex];
  };

  // Pastikan function formatDate ini bekerja dengan benar
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;

    // Debug log untuk memastikan format benar
    console.log('formatDate input:', date, 'output:', formatted);

    return formatted;
  };

  const fetchData = useCallback(async () => {
    try {
      if (!locationId) {
        console.error('Location ID is required');
        return;
      }

      const [sportsResponse, scheduleResponse] = await Promise.all([
        getSportsByLocation(locationId),
        getSchedule(locationId, {
          date: selectedDate,
          sportName: selectedSport || sportName || undefined
        })
      ]);
      console.log('Response Schedule: ', scheduleResponse);
      setSports(sportsResponse.data || []);

      const allFields = scheduleResponse.fields || [];
      const courtsList = allFields.map((field: { fieldName: any; }) => field.fieldName);
      setCourts(courtsList);

      // Proses data schedule
      const processedSchedules = allFields.flatMap((field: any) => {
        const dailySchedules = field.dailySchedules || [];
        return dailySchedules.flatMap((daily: any) => {
          const schedules = daily.schedules || [];
          return schedules.map((schedule: any) => ({
            fieldId: field.fieldId,
            court: field.fieldName,
            date: daily.date,
            time: schedule.time,
            timeId: schedule.timeId,
            price: parseInt(schedule.price?.replace(/[^\d]/g, '') || '0'), // Konversi ke number
            status: schedule.status,
            sport: field.sport || selectedSport || sportName, // Tambahkan field sport
            locationId: locationId,
            isBooked: schedule.isBooked,
          }));
        });
      });

      setSchedule(processedSchedules);

      // Generate dates dari API response
      const startDate = new Date(scheduleResponse.start_date);
      const endDate = new Date(scheduleResponse.end_date);
      const upcomingDates: any[] = [];

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(new Date(d));
        upcomingDates.push({
          day: getDayName(d.getDay()),
          date: dateStr,
          month: getMonthName(d.getMonth()),
          displayDate: d.getDate().toString()
        });
      }

      setDates(upcomingDates);
      if (!selectedDate && upcomingDates.length > 0) {
        setSelectedDate(upcomingDates[0].date);
      }

    } catch (err) {
      console.error('Gagal fetch data:', err);
    }
  }, [locationId, selectedDate, selectedSport, sportName]);

  useEffect(() => {
    if (!selectedDate || !locationId) return;

    const slots: Record<string, any[]> = {};

    // Filter berdasarkan sportName jika ada
    const filtered = schedule.filter(s =>
      s.date === selectedDate &&
      (!selectedSport || s.sport === selectedSport)
    );

    // Isi time slots
    filtered.forEach((slot) => {
      const court = slot.court;

      if (!slots[court]) {
        slots[court] = [];
      }

      if (!slots[court]) {
        console.warn(`Court ${court} not found in courts list`);
        return;
      }

      // Format waktu
      const timeParts = slot.time.split(':');
      const hour = parseInt(timeParts[0]);
      const nextHour = hour + 1 === 24 ? 0 : hour + 1;
      const formattedTime = `${hour.toString().padStart(2, '0')} - ${nextHour.toString().padStart(2, '0')}`;

      slots[court].push({
        time: formattedTime,
        originalTime: slot.time,
        timeId: slot.timeId,
        fieldId: slot.fieldId,
        status: slot.status,
        booked: slot.isBooked,
        price: typeof slot.price === 'string' ? parseInt(slot.price.replace(/[^\d]/g, '')) : slot.price || 60000,
        locationId: slot.locationId,
      });
    });
    console.log('Slots yang diterima: ', slots);
    setTimeSlotsByCourt(slots);
  }, [schedule, selectedDate, locationId, courts, selectedSport]);

  useEffect(() => {
    if (locationId) {
      fetchData();
    }
  }, [locationId, fetchData]);

  useEffect(() => {
    // Filter schedule for selected date
    const filtered = schedule.filter((s) => s.date === selectedDate);
    const slots: Record<string, any[]> = {};

    // Organize slots by court
    filtered.forEach((slot) => {
      const court = slot.court;
      if (!slots[court]) slots[court] = [];

      slots[court].push({
        fieldId: slot.fieldId,
        time: slot.time,
        timeId: slot.timeId,
        status: slot.status,
        booked: slot.isBooked,
        price: slot.price || 60000 // Default price if not provided
      });
    });

    setTimeSlotsByCourt(slots);
  }, [schedule, selectedDate, courts]);

  useEffect(() => {
    if (selectedSlots.length > 0) {
      setShowDetails(true);
    }
  }, [selectedSlots]);

  useEffect(() => {
    if (!membershipId) return;

    getMembershipById(parseInt(membershipId)).then(data => {
      if (data) {
        setMembershipsData(data);
        // Generate default recurring weeks [0,1,2,3]
        setRecurringWeeks(Array.from({ length: data.weeks }, (_, i) => i));
        console.log(data)
      }
    });
  }, [membershipId]);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(prev =>
      prev.includes(dropdownName)
        ? prev.filter(name => name !== dropdownName)
        : [...prev, dropdownName]
    );
  };

  const handleTimeClick = (date: string, time: string, court: string, price: string | number, fieldId: string, timeId: string) => {
    const priceNumber = typeof price === 'string' ? parseInt(price.replace(/[^\d]/g, '')) : price;

    if (membershipData) {
      // Untuk membership booking - recurring slots
      const bookings: { date: string; time: string; timeId: string; court: string; fieldId: string; price: number; }[] = [];
      const baseDate = new Date(date);
      const discountedPrice = priceNumber;

      for (let i = 0; i < membershipData.weeks; i++) {
        const bookingDate = new Date(baseDate);
        bookingDate.setDate(baseDate.getDate() + (i * 7));

        bookings.push({
          date: formatDate(bookingDate),
          time,
          timeId,
          court,
          fieldId,
          price: discountedPrice,
        });
      }

      // Check if this time slot pattern already exists
      const existingPatternIndex = selectedSlots.findIndex(slot =>
        slot.time === time &&
        slot.court === court &&
        slot.fieldId === fieldId &&
        bookings.some(booking => booking.date === slot.date)
      );

      if (existingPatternIndex >= 0) {
        // Remove all slots for this pattern
        setSelectedSlots(prev =>
          prev.filter(slot =>
            !(slot.time === time &&
              slot.court === court &&
              slot.fieldId === fieldId &&
              bookings.some(booking => booking.date === slot.date))
          )
        );
      } else {
        // Add new pattern
        setSelectedSlots(prev => [...prev, ...bookings]);
      }
    } else {
      // Untuk regular booking - single slots (MULTIPLE SELECTION)
      setSelectedSlots(prev => {
        const existingIndex = prev.findIndex(slot =>
          slot.date === date &&
          slot.time === time &&
          slot.court === court &&
          slot.fieldId === fieldId
        );

        if (existingIndex >= 0) {
          // Remove if already selected
          return prev.filter((_, index) => index !== existingIndex);
        } else {
          // Add new slot - TIDAK MENGGANTI YANG SUDAH ADA
          return [...prev, {
            date,
            time,
            timeId,
            court,
            fieldId,
            price: priceNumber || 0
          }];
        }
      });
    }
  };

  const calculateDiscount = (total: number): number => {
    if (!membershipData) {
      return 0;
    }
    return total * (membershipData.discount / 100);
  }

  const calculateTotal = () => {
    const subtotal = selectedSlots.reduce((sum, slot) => {
      const price = typeof slot.price === 'string'
        ? parseInt((slot.price as string).replace(/[^\d]/g, '')) || 0
        : slot.price || 0;
      return sum + price;
    }, 0);

    const discount = calculateDiscount(subtotal);

    return {
      subtotal,
      discount,
      total: subtotal - discount
    };
  };

  const handlePayment = useCallback(() => {
    if (selectedSlots.length === 0) return;

    const userId = Cookies.get('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    // Organize slots by date and court
    const bookings = Object.entries(
      selectedSlots.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = {};
        if (!acc[slot.date][slot.court]) {
          acc[slot.date][slot.court] = {
            fieldId: slot.fieldId,
            times: [],
            timeIds: [],
            price: 0
          };
        }
        acc[slot.date][slot.court].times.push(slot.time);
        acc[slot.date][slot.court].timeIds.push(slot.timeId);
        acc[slot.date][slot.court].price += slot.price;
        return acc;
      }, {} as Record<string, Record<string, { fieldId: string; times: string[]; timeIds: string[]; price: number }>>)
    ).map(([date, courts]) =>
      Object.entries(courts).map(([court, data]) => ({
        date,
        field: court,
        fieldId: data.fieldId,
        times: data.times,       // Langsung sebagai array
        timeIds: data.timeIds,   // Langsung sebagai array
        price: data.price
      }))
    ).flat();

    const totals = calculateTotal();

    const paymentData: PaymentData = {
      bookings,
      locationId: locationId ?? '',
      paymentType: selectedPaymentType.toLowerCase() as 'reguler' | 'membership',
      userId,
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
      ...(membershipId && { membershipId }),
    };

    console.log('Payment Data:', paymentData);

    const encodedData = encodeURIComponent(JSON.stringify(paymentData));
    router.push(`/reservation/payment?data=${encodedData}`);
  }, [selectedSlots, locationId, selectedPaymentType, membershipId, router, calculateTotal]);

  const minimumPrice = Math.min(...schedule.map(s => s.price || 0));
  const formattedMinimumPrice = minimumPrice.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return (
    <UserLayout>
      {/* <div className='min-h-screen bg-[#f8f8f8]' suppressHydrationWarning> */}
      <div className='mx-auto max-w-6xl px-4 py-5'>
        {/* Image & Price */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
          <div className='md:col-span-6'>
            <Image
              src='/images/futsal.png'
              alt='Lapangan'
              width={700}
              height={400}
              className='h-[350px] w-[500px] rounded-xl object-cover'
            />
          </div>
          <div className='flex flex-col gap-4 md:col-span-6'>
            <div className='flex flex-1 flex-col rounded-xl bg-white p-4 shadow-md'>
              <p className='text-base text-gray-500'>Mulai dari</p>
              <div className='flex items-end'>
                <p className='text-xl font-semibold text-black'>{formattedMinimumPrice}</p>
                <span className='ml-1 text-sm text-gray-500'>/sesi</span>
              </div>
              <Button
                className='mt-3 w-full bg-orange-500 hover:bg-orange-600'
                onClick={() => {
                  scheduleRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                  setOpenDropdown(['schedule-section']);
                }}
              >
                Cek Ketersediaan
              </Button>
            </div>

            <div id="schedule-section" ref={scheduleRef} className='flex flex-1 flex-col rounded-xl bg-white p-4 shadow-md'>
              <div className='mb-2 flex items-center gap-2'>
                {/* <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                      Paket Langganan
                    </span> */}
              </div>
              <h2 className='mb-2 text-lg font-semibold text-black'>
                Paket Langganan
              </h2>
              <ul className='mb-4 list-inside list-disc space-y-1 text-sm text-gray-600'>
                <li>Hemat hingga 30% dengan diskon sesuai paket langganan</li>
                <li>Pesan sekali untuk jadwal rutin mingguan mulai (2-4 minggu)</li>
                <li>Booking banyak lapangan & waktu dalam satu transaksi</li>
                <li>Prioritas slot permainan di hari yang sama setiap minggu</li>
              </ul>
              <Button
                onClick={() => router.push('../membership')}
                className='w-full bg-orange-500 hover:bg-orange-600'
              >
                Lihat Paket
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Date Picker & Filter Section */}
        <div className='mt-8 mb-8'>
          {/* Section Header */}
          <div className='mb-4 flex items-center gap-2'>
            <Image src='/icons/arrow.svg' alt='-' width={26} height={26} />
            <p className='text-2xl font-semibold text-black'>
              Pilih Lapangan
            </p>
          </div>

          {/* Main Container */}
          <div className='rounded-2xl bg-[#2C473A] p-5 shadow-lg'>
            {/* Date and Filter Controls */}
            <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
              {/* Date Selector */}
              <div className='flex items-center gap-8 w-full md:w-auto'>
                <div className='flex overflow-x-auto pt-1 pb-1 gap-2 md:flex-wrap md:overflow-visible scrollbar-hide flex-1'>
                  {dates.map(({ day, date, month, displayDate }) => {
                    const isSelected = selectedDate === date;
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`min-w-[110px] flex flex-col items-center justify-center rounded-xl py-4 px-2 transition-all ${isSelected
                          ? 'bg-[#C5FC40] shadow-md transform scale-105'
                          : 'bg-[#3A5849] hover:bg-[#4D6B5C]'
                          }`}
                      >
                        <span className={`text-xs font-medium ${isSelected ? 'text-gray-800' : 'text-gray-300'
                          }`}>
                          {day}
                        </span>
                        <span className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-white'
                          }`}>
                          {displayDate} {month}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Button */}
                <button
                  onClick={() => setOpenDropdown(openDropdown.includes('calendar') ? [] : ['calendar'])}
                  className='p-3 rounded-lg bg-[#3A5849] hover:bg-[#4D6B5C] transition-colors flex-shrink-0'
                  aria-label='Open calendar'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                    <line x1='16' y1='2' x2='16' y2='6'></line>
                    <line x1='8' y1='2' x2='8' y2='6'></line>
                    <line x1='3' y1='10' x2='21' y2='10'></line>
                  </svg>
                </button>
              </div>

              {/* Responsive divider - hidden on mobile/tablet */}
              <div className='hidden md:flex items-center justify-center'>
                <div className='w-px h-[35px] bg-gray-300'></div>
              </div>

              {/* Sport Filter */}
              <div className='relative w-full md:w-auto'>
                <button
                  onClick={() => toggleDropdown('sport')}
                  className='flex items-center justify-between gap-2 text-white bg-[#3A5849] hover:bg-[#4D6B5C] rounded-lg px-4 py-3 w-full transition-colors'
                  disabled={!!membershipId}
                >
                  <span className='text-sm font-medium truncate'>
                    {selectedSport || sportName || 'Pilih Cabor'}
                  </span>
                  <ChevronDownCircle
                    className={`h-5 w-5 transition-transform ${openDropdown.includes('sport') ? 'rotate-180' : ''
                      }`}
                    stroke="currentColor"
                  />
                </button>

                {openDropdown.includes('sport') && (
                  <div className='absolute z-10 mt-2 w-full rounded-lg bg-[#3A5849] shadow-xl border border-[#4D6B5C] overflow-hidden'>
                    <div className='py-1 max-h-60 overflow-y-auto'>
                      {[...sports.map(sport => sport.sportName)].map((sportName) => (
                        <button
                          key={`sport-${sportName}`}
                          onClick={() => {
                            setSelectedSport(sportName);
                            toggleDropdown('sport');

                          }}
                          className={`w-full px-4 py-2 text-sm text-left text-white hover:bg-[#C5FC40] hover:text-gray-900 transition-colors ${selectedSport === sportName ? 'bg-[#C5FC40] text-gray-900 font-medium' : ''
                            }`}
                        >
                          {sportName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Dropdown - Fixed Version */}
            {openDropdown.includes('calendar') && (
              <div className="mt-4 rounded-xl bg-[#3A5849] p-5 shadow-xl border border-[#4D6B5C]">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Current Month */}
                  <div className='flex-1'>
                    <h3 className='mb-3 text-center text-lg font-semibold text-white'>
                      {getMonthName(new Date().getMonth())} {new Date().getFullYear()}
                    </h3>
                    <div className='grid grid-cols-7 gap-1'>
                      {/* Day headers - full width */}
                      {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(
                        (day) => (
                          <div
                            key={day}
                            className='py-2 text-center text-xs font-medium text-gray-300 w-full'
                          >
                            {day}
                          </div>
                        )
                      )}

                      {/* Dates */}
                      {(() => {
                        const currentDate = new Date();
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        const firstDay = new Date(year, month, 1).getDay(); // 0 (Minggu) - 6 (Sabtu)
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        const prevMonthDays = new Date(year, month, 0).getDate();

                        // Create array for all cells (6 weeks)
                        const totalCells = 42;
                        const cells = [];

                        // Previous month days
                        for (let i = 0; i < firstDay; i++) {
                          const dayNumber = prevMonthDays - (firstDay - 1 - i);
                          cells.push(
                            <div
                              key={`prev-${i}`}
                              className='h-10 flex items-center justify-center text-gray-500 text-sm'
                            >
                              {dayNumber}
                            </div>
                          );
                        }

                        // Current month days
                        for (let i = 1; i <= daysInMonth; i++) {
                          const dateStr = formatDate(new Date(year, month, i));
                          const isSelected = selectedDate === dateStr;
                          const isToday = i === currentDate.getDate() &&
                            month === currentDate.getMonth() &&
                            year === currentDate.getFullYear();
                          const isPastDate = new Date(year, month, i) < new Date(new Date().setHours(0, 0, 0, 0));

                          cells.push(
                            <button
                              key={`current-${i}`}
                              onClick={() => {
                                if (!isPastDate) {
                                  setSelectedDate(dateStr);
                                  // Tutup dropdown kalender setelah memilih tanggal
                                  setOpenDropdown(prev => prev.filter(item => item !== 'calendar'));
                                }
                              }}
                              disabled={isPastDate}
                              className={`h-10 w-full mx-auto rounded-full flex items-center justify-center text-sm transition-all ${isPastDate ? 'text-gray-500 cursor-not-allowed' :
                                isSelected ? 'bg-[#C5FC40] text-gray-900 font-bold shadow-md' :
                                  isToday ? 'bg-[#A0D631] text-white font-semibold' :
                                    'text-white hover:bg-[#4D6B5C] hover:font-medium'
                                }`}
                            >
                              {i}
                            </button>
                          );
                        }

                        // Next month days
                        const remainingCells = totalCells - cells.length;
                        for (let i = 1; i <= remainingCells; i++) {
                          cells.push(
                            <div
                              key={`next-${i}`}
                              className='h-10 flex items-center justify-center text-gray-500 text-sm'
                            >
                              {i}
                            </div>
                          );
                        }

                        return cells;
                      })()}
                    </div>
                  </div>

                  {/* Next Month */}
                  <div className='flex-1'>
                    {(() => {
                      const currentDate = new Date();
                      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                      const nextYear = nextMonth.getFullYear();
                      const nextMonthIndex = nextMonth.getMonth();

                      return (
                        <>
                          <h3 className='mb-3 text-center text-lg font-semibold text-white'>
                            {getMonthName(nextMonthIndex)} {nextYear}
                          </h3>
                          <div className='grid grid-cols-7 gap-1'>
                            {/* Day headers - full width */}
                            {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(
                              (day) => (
                                <div
                                  key={`next-${day}`}
                                  className='py-2 text-center text-xs font-medium text-gray-300 w-full'
                                >
                                  {day}
                                </div>
                              )
                            )}

                            {/* Dates for next month */}
                            {(() => {
                              const firstDay = new Date(nextYear, nextMonthIndex, 1).getDay();
                              const daysInMonth = new Date(nextYear, nextMonthIndex + 1, 0).getDate();
                              const prevMonthDays = new Date(nextYear, nextMonthIndex, 0).getDate();

                              // Create array for all cells (6 weeks)
                              const totalCells = 42;
                              const cells = [];

                              // Previous month days
                              for (let i = 0; i < firstDay; i++) {
                                const dayNumber = prevMonthDays - (firstDay - 1 - i);
                                cells.push(
                                  <div
                                    key={`next-prev-${i}`}
                                    className='h-10 flex items-center justify-center text-gray-500 text-sm'
                                  >
                                    {dayNumber}
                                  </div>
                                );
                              }

                              // Current month days
                              for (let i = 1; i <= daysInMonth; i++) {
                                const dateStr = formatDate(new Date(nextYear, nextMonthIndex, i));
                                const isSelected = selectedDate === dateStr;

                                cells.push(
                                  <button
                                    key={`next-current-${i}`}
                                    onClick={() => {
                                      setSelectedDate(dateStr);
                                      // Tutup dropdown kalender setelah memilih tanggal
                                      setOpenDropdown(prev => prev.filter(item => item !== 'calendar'));
                                    }}
                                    className={`h-10 w-full mx-auto rounded-full flex items-center justify-center text-sm transition-all ${isSelected ? 'bg-[#C5FC40] text-gray-900 font-bold shadow-md' :
                                      'text-white hover:bg-[#4D6B5C] hover:font-medium'
                                      }`}
                                  >
                                    {i}
                                  </button>
                                );
                              }

                              // Next month days
                              const remainingCells = totalCells - cells.length;
                              for (let i = 1; i <= remainingCells; i++) {
                                cells.push(
                                  <div
                                    key={`next-next-${i}`}
                                    className='h-10 flex items-center justify-center text-gray-500 text-sm'
                                  >
                                    {i}
                                  </div>
                                );
                              }

                              return cells;
                            })()}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Court Time Slots */}
        <div className='mt-8 space-y-6'>
          {courts.map((court, index) => {
            const courtSlots = timeSlotsByCourt[court] || [];
            const availableCount = courtSlots.filter(slot => !slot.booked).length;
            const currentSport = selectedSport || sportName;

            return (
              <div key={`${court}-${index}`} className={`${index !== 0 ? 'border-t border-gray-300 pt-6' : ''}`}>
                <div className='mb-4'>
                  <p className='text-lg font-semibold text-black'>{court}</p>
                  <p className='text-sm text-gray-600'>
                    {currentSport === 'Badminton' ? 'Lapangan Badminton' :
                      currentSport === 'Basket' ? 'Lapangan Basket' :
                        'Lapangan Futsal'}
                  </p>
                </div>

                <div className='relative'>
                  <button
                    onClick={() => toggleDropdown(court)}
                    className='text-black flex items-center gap-1 rounded-lg bg-[#C5FC40] px-5 py-3 text-sm font-semibold hover:bg-lime-300'
                  >
                    {availableCount} Jadwal Tersedia
                    <ChevronDownCircle
                      className={`h-5 w-5 transition-transform ${openDropdown.includes(court) ? 'rotate-180' : ''}`}
                      stroke="currentColor"
                    />
                  </button>

                  {openDropdown.includes(court) && (
                    <div className='mt-4 w-full rounded-md'>
                      <div className='grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-6'>
                        {courtSlots.map((slot, idx) => {
                          const isSelected = selectedSlots.some(s =>
                            s.date === selectedDate && s.time === slot.time && s.court === court && s.fieldId === slot.fieldId
                          );
                          const isBooked = slot.booked;
                          const priceFormatted = `Rp ${slot.price.toLocaleString('id-ID')}`;

                          return (
                            <button
                              key={`${slot.timeId}-${idx}`}
                              onClick={() => {
                                console.log('Slot data before click:', slot); // Debugging
                                console.log('Slot:' + slot.timeId + " " + slot.booked);
                                handleTimeClick(selectedDate, slot.time, court, slot.price, slot.fieldId, slot.timeId)
                              }
                              }
                              disabled={isBooked}
                              className={`relative rounded-lg border px-3 py-4 text-center text-base transition-all ${isBooked
                                ? 'pointer-events-none border-gray-200 text-gray-400'
                                : isSelected
                                  ? 'border-lime-400 bg-lime-50 text-black cursor-pointer'
                                  : 'border-gray-300 bg-white hover:border-lime-300 hover:bg-lime-50 cursor-pointer'
                                }`}
                            >
                              <div className='mb-1 text-xs font-medium text-[#A0A4A8]'>
                                60 menit
                              </div>
                              <div className={`mb-1 text-base font-semibold ${isBooked ? 'text-gray-400' : 'text-black'}`}>
                                {slot.time}
                              </div>
                              <div className={`text-sm ${isBooked ? 'text-gray-500' : 'text-[#2C473A]'}`}>
                                {isBooked ? 'BOOKED' : priceFormatted}
                              </div>
                              {isSelected && (
                                <div className='absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-lime-400'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-4 w-4 text-white'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    strokeWidth='3'
                                  >
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                                  </svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className='space-y-4 rounded-xl border bg-[#2C473A] p-4 shadow-sm'>
            {/* Summary info row - responsive layout */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-medium text-white'>
                  {selectedSlots.length} lapangan dipilih
                </p>
                <button
                  className='text-white flex items-center'
                  onClick={() => setShowDetails((prev) => !prev)}
                  disabled={selectedSlots.length === 0}
                >
                  <ChevronDownCircle
                    className={`h-5 w-5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                    stroke="white"
                  />
                </button>
              </div>

              {/* Buttons - only visible on desktop */}
              <div className='hidden md:flex flex-wrap items-center font-medium gap-4'>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('paymentType')}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#C5FC40] px-4 py-2 text-sm text-black hover:bg-lime-300"
                    disabled={!!membershipId}
                  >
                    {selectedPaymentType}
                    {!membershipId && (
                      <ChevronDownCircle
                        className={`h-5 w-5 transition-transform ${openDropdown.includes('paymentType') ? 'rotate-180' : ''}`}
                        stroke="currentColor"
                      />
                    )}
                  </button>

                  {openDropdown?.includes('paymentType') && !membershipId && (
                    <div className="absolute right-0 top-full mt-1 rounded-md text-black bg-[#C5FC40] py-1 shadow-lg z-20 min-w-full">
                      <button
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={() => {
                          setSelectedPaymentType('Reguler');
                          toggleDropdown('paymentType');
                        }}
                      >
                        Reguler
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={() => {
                          setSelectedPaymentType('membership');
                          toggleDropdown('paymentType');
                        }}
                      >
                        Langganan
                      </button>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handlePayment}
                  className='bg-orange-500 hover:bg-orange-600 px-8 py-3 font-semibold cursor-pointer'
                  disabled={selectedSlots.length === 0}
                >
                  BAYAR
                </Button>
              </div>
            </div>

            {/* Dropdown details - show by default if any time slots are selected */}
            {showDetails && selectedSlots.length > 0 && (
              <div className='mt-2 border-t pt-3'>
                <div className='space-y-4'>
                  {/* Group slots by date and then by court */}
                  {Object.entries(
                    selectedSlots.reduce<Record<string, Record<string, typeof selectedSlots[0][]>>>((acc, slot) => {
                      if (!acc[slot.date]) {
                        acc[slot.date] = {};
                      }
                      if (!acc[slot.date][slot.court]) {
                        acc[slot.date][slot.court] = [];
                      }
                      acc[slot.date][slot.court].push(slot);
                      return acc;
                    }, {})
                  ).map(([dateString, courts]) => {
                    const dateObj = new Date(dateString);
                    const formattedDate = dateObj.toLocaleDateString('id-ID', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    });

                    return (
                      <div key={dateString}>
                        {/* Date header */}
                        <p className='font-medium text-white mb-2'>{formattedDate}</p>

                        {/* Group by court */}
                        {Object.entries(courts).map(([courtName, courtSlots]) => (
                          <div key={`${dateString}-${courtName}`} className='ml-3 mb-3'>
                            {/* Court name */}
                            <p className='text-white font-medium space-y-1.5'>{courtName}</p>

                            {/* Times list */}
                            <div className='ml-3 space-y-1'>
                              {courtSlots.map((slot, idx) => (
                                <div key={`${slot.date}-${slot.time}-${idx}`} className='flex items-center justify-between text-sm'>
                                  <p className='text-white'>{slot.time}</p>
                                  <p className='text-white'>Rp {slot.price.toLocaleString('id-ID')}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                {/* Total */}
                <div className='mt-3 space-y-2 border-t pt-3 text-white'>
                  <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>Rp {calculateTotal().subtotal.toLocaleString('id-ID')}</p>
                  </div>
                  {membershipData && (
                    <div className='flex justify-between'>
                      <p className="text-sm sm:text-base">{membershipData.name} Diskon: ({membershipData.discount}%)</p>
                      <p>- Rp {calculateTotal().discount.toLocaleString('id-ID')}</p>
                    </div>
                  )}
                  <div className='flex justify-between font-bold'>
                    <p>Total</p>
                    <p>Rp {calculateTotal().total.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {/* Mobile buttons - only visible on mobile */}
                <div className='md:hidden flex flex-col gap-3 mt-4'>
                  <div className="relative w-full">
                    <button
                      onClick={() => toggleDropdown('paymentType')}
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#C5FC40] px-4 py-2 text-sm text-black hover:bg-lime-300 w-full"
                      disabled={!!membershipId}
                    >
                      {selectedPaymentType}
                      {!membershipId && (
                        <ChevronDownCircle
                          className={`h-5 w-5 transition-transform ${openDropdown.includes('paymentType') ? 'rotate-180' : ''}`}
                          stroke="currentColor"
                        />
                      )}
                    </button>

                    {openDropdown?.includes('paymentType') && !membershipId && (
                      <div className="absolute right-0 top-full mt-1 rounded-md text-black bg-[#C5FC40] py-1 shadow-lg z-20 w-full">
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setSelectedPaymentType('Reguler');
                            toggleDropdown('paymentType');
                          }}
                        >
                          Reguler
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            setSelectedPaymentType('membership');
                            toggleDropdown('paymentType');
                          }}
                        >
                          Langganan
                        </button>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handlePayment}
                    className='w-full bg-orange-500 hover:bg-orange-600 px-4 py-3 font-semibold cursor-pointer'
                    disabled={selectedSlots.length === 0}
                  >
                    BAYAR
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </UserLayout>
  );
}