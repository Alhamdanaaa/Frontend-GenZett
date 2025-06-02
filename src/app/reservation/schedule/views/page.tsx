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
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>(membershipId ? 'Langganan' : 'Reguler');

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
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[dayIndex];
  };

  const getMonthName = (monthIndex: number): string => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return months[monthIndex];
  };

  const formatDate = (date: Date) => date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

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
            locationId: locationId
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
      const formattedTime = `${hour.toString().padStart(2, '0')}:00 - ${nextHour.toString().padStart(2, '0')}:00`;

      slots[court].push({
        time: formattedTime,
        originalTime: slot.time,
        timeId: slot.timeId,
        fieldId: slot.fieldId,
        booked: slot.isBooked, 
        price: typeof slot.price === 'string' ? parseInt(slot.price.replace(/[^\d]/g, '')) : slot.price || 60000,
        locationId: slot.locationId,
      });
    });

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
        booked: slot.status === 'booked',
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
    if (membershipData) {
      const bookings = [];
      const baseDate = new Date();
      const priceNumber = typeof price === 'string' ? parseInt(price.replace(/[^\d]/g, '')) : price;
      const discountedPrice = priceNumber * (1 - membershipData.discount);

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
        })
      }
      setSelectedSlots(bookings);
    } else {
      const priceNumber = typeof price === 'string'
        ? parseInt(price.replace(/[^\d]/g, ''))
        : price;

      setSelectedSlots(prev => {
        const existingIndex = prev.findIndex(slot =>
          slot.date === date && slot.time === time && slot.court === court
        );

        if (existingIndex >= 0) {
          return prev.filter((_, index) => index !== existingIndex);
        } else {
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
  // Handle time slot selection
  const handleTimeSelect = (
    date: string,
    time: string,
    court: string,
    price: number,
    fieldId: string,
    timeId: string // <-- add timeId parameter
  ) => {
    if (!membershipData) {
      // Regular booking (single slot)
      setSelectedSlots(prev =>
        prev.some(s => s.date === date && s.time === time && s.court === court && s.fieldId === fieldId)
          ? prev.filter(s => !(s.date === date && s.time === time && s.court === court && s.fieldId === fieldId))
          : [...prev, { date, time, timeId, court, fieldId, price }]
      );
      return;
    }
  
    // Membership booking - recurring slots
    const baseDate = new Date(date);
    const newSlots: TimeSlot[] = [];
  
    recurringWeeks.forEach(week => {
      const slotDate = new Date(baseDate);
      slotDate.setDate(baseDate.getDate() + (week * 7));
  
      newSlots.push({
        date: slotDate.toISOString().split('T')[0],
        time,
        timeId,
        court,
        fieldId,
        price: price * (1 - membershipData.discount) // Apply discount
      });
    });
  
    setSelectedSlots(prev => {
      // Remove existing slots for same time pattern
      const filtered = prev.filter(slot =>
        !(slot.time === time && slot.court === court &&
          recurringWeeks.some(week => {
            const weekDate = new Date(baseDate);
            weekDate.setDate(baseDate.getDate() + (week * 7));
            return slot.date === weekDate.toISOString().split('T')[0];
          })
        )
      );
  
      // Add new slots if not already selected
      const existing = filtered.some(s =>
        newSlots.some(ns =>
          ns.date === s.date && ns.time === s.time && ns.court === s.court && ns.fieldId === s.fieldId
        )
      );
  
      return existing ? filtered : [...filtered, ...newSlots];
    });
  };

  const handlePayment = useCallback(() => {
    if (selectedSlots.length === 0) return;

    const userId = Cookies.get('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    // Siapkan data yang akan dikirim
    const paymentData = {
      selectedSlots: selectedSlots.map(slot => ({
        date: slot.date,
        time: slot.time,
        timeId: slot.timeId,
        court: slot.court,
        fieldId: slot.fieldId,
        price: slot.price,
      })),
      locationId: locationId ?? '',
      paymentType: selectedPaymentType,
      userId: userId,
      ...(membershipId && { membershipId }),
    };

    console.log('Payment Data:', paymentData);
    // console.log('Processed schedules:', processedSchedules);
    console.log('Time slots by court:', timeSlotsByCourt);

    // Encode data untuk URL
    const encodedData = encodeURIComponent(JSON.stringify(paymentData));

    // Navigasi ke halaman payment dengan data
    router.push(`/reservation/payment?data=${encodedData}`); 
  }, [selectedSlots, locationId, selectedPaymentType, membershipId, timeSlotsByCourt, router]);

  const calculateTotal = () => {
    return selectedSlots.reduce((sum, slot) => {

      const price = typeof slot.price === 'string'
        ? parseInt((slot.price as string).replace(/[^\d]/g, '')) || 0
        : slot.price || 0;
      return sum + price;
    }, 0);
  };

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
                <li>Diskon hingga 20% untuk booking rutin</li>
                <li>Jadwal prioritas setiap minggu</li>
                <li>Gratis 1 jam setiap 5x pemesanan</li>
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

        {/* Date Picker & Filter */}
        <div className='mt-6 mb-6'>
          <div className='mb-4 flex items-center gap-2'>
            <Image src='/icons/arrow.svg' alt='-' width={26} height={26} />
            <p className='text-2xl font-semibold text-black'>
              Pilih Lapangan
            </p>
          </div>

          <div className='rounded-2xl bg-[#2C473A] p-4'>
            {/* Date selector */}
            <div className='flex justify-between overflow-x-auto'>
              {dates.map(({ day, date, month, displayDate }) => {
                const isSelected = selectedDate === date;
                return (
                  <div
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`min-w-[100px] cursor-pointer rounded-2xl py-3 text-center text-sm font-medium transition-all ${isSelected
                      ? 'bg-[#C5FC40]'
                      : 'bg-[#2C473A] hover:bg-[#3A5849]'
                      }`}
                  >
                    <div
                      className={`${isSelected ? 'text-black' : 'text-[#A0A4A8]'
                        }`}
                    >
                      {day}
                    </div>
                    <div
                      className={`${isSelected ? 'text-black font-bold' : 'text-white'
                        }`}
                    >
                      {displayDate} {month}
                    </div>
                  </div>
                );
              })}
              <div className='flex items-center justify-center'>
                <div className='w-px h-[35px] bg-gray-300'></div>
              </div>
              <div className='flex flex-row items-center justify-between'>
                <div className='flex items-center'>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown.includes('calendar') ? [] : ['calendar'])
                    }
                    className='flex items-center gap-2 text-white cursor-pointer'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <rect
                        x='3'
                        y='4'
                        width='18'
                        height='18'
                        rx='2'
                        ry='2'
                      ></rect>
                      <line x1='16' y1='2' x2='16' y2='6'></line>
                      <line x1='8' y1='2' x2='8' y2='6'></line>
                      <line x1='3' y1='10' x2='21' y2='10'></line>
                    </svg>
                    {/* <span className='text-sm'>Pilih Tanggal</span> */}
                  </button>
                </div>
              </div>

              <div className='flex items-center'>
                <button
                  onClick={() => toggleDropdown('sport')}
                  className='flex items-center justify-between gap-1 text-white border border-[#3A5849] rounded-lg px-3 py-3 cursor-pointer mr-2'
                  style={{ width: '140px' }}
                >
                  <span className='text-sm truncate'>{selectedSport || sportName || 'Pilih Cabor'}</span>
                  <ChevronDownCircle
                    className={`h-5 w-5 transition-transform ${openDropdown.includes('sport') ? 'rotate-180' : ''}`}
                    stroke="currentColor"
                  />
                </button>

                {openDropdown.includes('sport') && (
                  <div className='absolute mt-2 z-10 rounded-lg bg-[#2C473A] p-2 shadow-lg'
                    style={{ width: '140px' }}>
                    <div className='flex flex-col'>
                      {['Semua', ...sports.map(sport => sport.sportName)].map((sportName) => (
                        <button
                          key={`sport-${typeof sportName === 'string' ? sportName : 'unknown'}`}
                          onClick={() => {
                            setSelectedSport(sportName === 'Semua' ? null : sportName);
                            toggleDropdown('sport');
                          }}
                          className={`rounded-lg px-3 py-2 text-sm text-left text-white hover:bg-[#C5FC40] ${selectedSport === sportName ? 'bg-[#C5FC40]' : ''}`}
                        >
                          {sportName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar dropdown - Two months side by side */}
            {openDropdown.includes('calendar') && (
              <div className='mt-4 rounded-lg bg-[#2C473A] p-3 shadow-lg'>
                <div className='flex flex-row gap-4'>
                  {/* Current Month */}
                  <div className='flex-1'>
                    <div className='mb-2 text-center text-white font-medium'>
                      {getMonthName(new Date().getMonth())}{' '}
                      {new Date().getFullYear()}
                    </div>
                    <div className='grid grid-cols-7 gap-1'>
                      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(
                        (day) => (
                          <div
                            key={day}
                            className='py-1 text-center text-xs font-medium text-gray-400'
                          >
                            {day}
                          </div>
                        )
                      )}
                      {(() => {
                        const currentDate = new Date();
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        const firstDay = new Date(year, month, 1).getDay();
                        const daysInMonth = new Date(
                          year,
                          month + 1,
                          0
                        ).getDate();

                        return Array.from({ length: 42 }, (_, i) => {
                          const dayNumber = i - firstDay + 1;
                          const isCurrentMonth =
                            dayNumber > 0 && dayNumber <= daysInMonth;
                          const isToday =
                            isCurrentMonth &&
                            dayNumber === currentDate.getDate();

                          // Create the date string in YYYY-MM-DD format for selected date
                          const thisDate = new Date(year, month, dayNumber);
                          const dateStr = isCurrentMonth ? formatDate(thisDate) : '';

                          const isSelected = isCurrentMonth && selectedDate === dateStr;
                          const isPastDate =
                            isCurrentMonth &&
                            dayNumber < currentDate.getDate();

                          if (!isCurrentMonth)
                            return (
                              <div
                                key={i}
                                className='p-2 text-center text-gray-300'
                              ></div>
                            );

                          return (
                            <div
                              key={i}
                              onClick={() => !isPastDate && setSelectedDate(dateStr)}
                              className={`cursor-pointer rounded-md p-2 text-center text-sm ${isPastDate
                                ? 'text-gray-300'
                                : isSelected
                                  ? 'bg-[#D5FF35] font-bold'
                                  : isToday
                                    ? 'bg-[#C5FC40] font-semibold'
                                    : 'hover:bg-gray-50'
                                }`}
                            >
                              {dayNumber}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Next Month */}
                  <div className='flex-1'>
                    <div className='mb-2 text-center font-medium'>
                      {getMonthName((new Date().getMonth() + 1) % 12)}{' '}
                      {new Date().getMonth() === 11
                        ? new Date().getFullYear() + 1
                        : new Date().getFullYear()}
                    </div>
                    <div className='grid grid-cols-7 gap-1'>
                      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(
                        (day) => (
                          <div
                            key={`next-${day}`}
                            className='py-1 text-center text-xs font-medium text-gray-500'
                          >
                            {day}
                          </div>
                        )
                      )}
                      {(() => {
                        const currentDate = new Date();
                        const year =
                          currentDate.getMonth() === 11
                            ? currentDate.getFullYear() + 1
                            : currentDate.getFullYear();
                        const month = (currentDate.getMonth() + 1) % 12;
                        const firstDay = new Date(year, month, 1).getDay();
                        const daysInMonth = new Date(
                          year,
                          month + 1,
                          0
                        ).getDate();

                        return Array.from({ length: 42 }, (_, i) => {
                          const dayNumber = i - firstDay + 1;
                          const isCurrentMonth =
                            dayNumber > 0 && dayNumber <= daysInMonth;

                          // Create the date string in YYYY-MM-DD format for next month
                          const nextMonthDate = new Date(year, month, dayNumber);
                          const dateStr = isCurrentMonth ? formatDate(nextMonthDate) : '';

                          if (!isCurrentMonth)
                            return (
                              <div
                                key={`next-${i}`}
                                className='p-2 text-center text-gray-300'
                              ></div>
                            );

                          return (
                            <div
                              key={`next-${i}`}
                              onClick={() => {
                                // Set the selected date with correct format
                                setSelectedDate(dateStr);
                                toggleDropdown('calendar');
                              }}
                              className='cursor-pointer rounded-md p-2 text-center font-medium text-sm hover:bg-[#C5FC40]'
                            >
                              {dayNumber}
                            </div>
                          );
                        });
                      })()}
                    </div>
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
                                console.log(slot.timeId);
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
            {/* Summary info row */}
            <div className='flex items-center justify-between'>
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
              <div className='flex items-center font-medium gap-4'>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('paymentType')}
                    className="flex items-center gap-2 rounded-lg bg-[#C5FC40] px-4 py-2 text-sm text-black hover:bg-lime-300"
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
                    <div className="absolute right-0 top-full mt-1 rounded-md text-black bg-[#C5FC40] py-1 shadow-lg z-20"
                      style={{ width: '100%' }}>
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
                          setSelectedPaymentType('Langganan');
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
                <div className='mt-3 flex justify-between border-t pt-3 text-white'>
                  <p className='font-bold'>Total</p>
                  <p className='font-bold'>
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </p>
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