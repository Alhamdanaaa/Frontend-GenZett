'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronDownCircle } from 'lucide-react';
import UserLayout from '@/app/user/layout';

export default function SchedulesPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<
    Array<{ time: string; booked: boolean }>
  >([]);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const [dates, setDates] = useState<
    Array<{ day: string; date: number; month: string }>
  >([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getDayName = (dayIndex: number): string => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[dayIndex];
  };

  const getMonthName = (monthIndex: number): string => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Ags',
      'Sep',
      'Okt',
      'Nov',
      'Des'
    ];
    return months[monthIndex];
  };

  useEffect(() => {
    // Ensure this runs only on client side
    if (typeof window !== 'undefined') {
      const today = new Date();
      const currentDate = today.getDate();

      const generatedDates = [];
      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        generatedDates.push({
          day: getDayName(nextDate.getDay()),
          date: nextDate.getDate(),
          month: getMonthName(nextDate.getMonth())
        });
      }

      setDates(generatedDates);
      setSelectedDate(currentDate);
      setTimeSlots(generateTimeSlots());
    }
  }, []);

  // Replace the random booking with deterministic logic
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 23; hour++) {
      const startHour = hour.toString().padStart(2, '0');
      const endHour = (hour + 1 === 24 ? 0 : hour + 1)
        .toString()
        .padStart(2, '0');
      slots.push({
        time: `${startHour}:00 - ${endHour}:00`,
        booked: hour % 4 === 0
      });
    }
    return slots;
  };

  const handleTimeClick = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  return (
    <UserLayout>
      {/* <div className='min-h-screen bg-[#f8f8f8]' suppressHydrationWarning> */}
      <div className='mx-auto max-w-6xl px-4 py-6'>
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
                <p className='text-xl font-semibold text-black'>Rp 60,000</p>
                <span className='ml-1 text-sm text-gray-500'>/sesi</span>
              </div>
              <Button className='mt-3 w-full bg-orange-500 hover:bg-orange-600'>
                Cek Ketersediaan
              </Button>
            </div>

            <div className='flex flex-1 flex-col rounded-xl bg-white p-4 shadow-md'>
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
              {dates.map(({ day, date, month }) => {
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
                      {date} {month}
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
                      setOpenDropdown(
                        openDropdown === 'calendar' ? null : 'calendar'
                      )
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
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === 'category' ? null : 'category'
                    )
                  }
                  className='flex items-center justify-between gap-1 text-white border border-[#3A5849] rounded-lg px-3 py-3 cursor-pointer'
                  style={{ width: '140px' }} // Fixed width for the button
                >
                  <span className='text-sm truncate'>{selectedCategory || 'Pilih Cabor'}</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className={`transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {openDropdown === 'category' && (
                  <div className='absolute mt-62 rounded-lg bg-white p-2 shadow-lg z-10'
                    style={{ width: '140px', left: 'auto', right: 'auto' }}>
                    <div className='flex flex-col'>
                      {['Semua', 'Badminton', 'Sepakbola', 'Basket', 'Renang'].map((sport) => (
                        <button
                          key={sport}
                          onClick={() => {
                            setSelectedCategory(sport);
                            console.log(sport);
                            setOpenDropdown(null);
                          }}
                          className='rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100 w-full truncate cursor-pointer'
                        >
                          {sport}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar dropdown - Two months side by side */}
            {openDropdown === 'calendar' && (
              <div className='mt-4 rounded-lg bg-white p-3 shadow-lg'>
                <div className='flex flex-row gap-4'>
                  {/* Current Month */}
                  <div className='flex-1'>
                    <div className='mb-2 text-center font-medium'>
                      {getMonthName(new Date().getMonth())}{' '}
                      {new Date().getFullYear()}
                    </div>
                    <div className='grid grid-cols-7 gap-1'>
                      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(
                        (day) => (
                          <div
                            key={day}
                            className='py-1 text-center text-xs font-medium text-gray-500'
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
                          const isSelected =
                            isCurrentMonth && dayNumber === selectedDate;
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
                              onClick={() =>
                                !isPastDate && setSelectedDate(dayNumber)
                              }
                              className={`cursor-pointer rounded-md p-2 text-center text-sm ${isPastDate
                                ? 'text-gray-300'
                                : isSelected
                                  ? 'bg-[#D5FF35] font-bold'
                                  : isToday
                                    ? 'bg-gray-100 font-semibold'
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
                                // Need to handle selection for next month in state
                                console.log(
                                  `Selected day ${dayNumber} in next month`
                                );
                              }}
                              className='cursor-pointer rounded-md p-2 text-center text-sm hover:bg-gray-50'
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

        {/* Court Time Slots - bg-white p-4 shadow-sm */}
        <div className='mt-8 space-y-6'>
          {['Lapangan 1', 'Lapangan 2'].map((court, index) => (
            <div key={index} className={`${index !== 0 ? 'border-t border-gray-300 pt-6' : ''}`}>
              <div className='mb-4'>
                <p className='text-lg font-semibold text-black'>{court}</p>
                <p className='text-sm text-gray-600'>Lapangan Badminton beralaskan karpet vinyl</p>
              </div>
              <div className='relative'>
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === court ? null : court)
                  }
                  className='flex items-center gap-1 rounded-lg bg-[#C5FC40] px-5 py-3 text-sm font-semibold hover:bg-lime-300'>
                  {timeSlots.filter((slot) => !slot.booked).length} Jadwal
                  Tersedia
                  <ChevronDownCircle
                    className={`h-5 w-5 transition-transform ${openDropdown === court ? 'rotate-180' : ''}`}
                    stroke="currentColor"
                  />
                </button>

                {/* Dropdown Content - bg-white shadow-lg*/}
                {(openDropdown === court || (openDropdown === null && index === 0)) && (
                  <div className='mt-4 w-full rounded-md'>
                    <div className='grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-6'>
                      {timeSlots.map((time, idx) => {
                        const key = `${court}|${time.time}`;
                        const isSelected = selectedTimes.includes(key);

                        return (
                          <button
                            key={idx}
                            onClick={() => !time.booked && handleTimeClick(key)}
                            disabled={time.booked}
                            className={`relative rounded-lg border px-3 py-4 text-center text-base transition-all ${time.booked
                              ? 'pointer-events-none border-gray-200 text-gray-400'
                              : isSelected
                                ? 'border-lime-400 bg-lime-50 text-black cursor-pointer'
                                : 'border-gray-300 bg-white hover:border-lime-300 hover:bg-lime-50 cursor-pointer'
                              }`}
                          >
                            <div className='mb-1 text-xs font-medium text-[#A0A4A8]'>
                              60 menit
                            </div>
                            <div className={`mb-1 text-base font-semibold ${time.booked ? 'text-gray-400' : 'text-black'}`}>
                              {time.time}
                            </div>
                            <div className={`text-sm ${time.booked ? 'text-gray-500' : 'text-[#2C473A]'}`}>
                              {time.booked ? 'BOOKED' : 'Rp60.000'}
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
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M5 13l4 4L19 7'
                                  />
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
          ))}

          <div className='space-y-4 rounded-xl border bg-[#2C473A] p-4 shadow-sm'>
            {/* Summary info row */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-medium text-white'>
                  {selectedTimes.length} lapangan dipilih
                </p>
                <button
                  className='text-white flex items-center'
                  onClick={() => setShowDetails((prev) => !prev)}
                >
                  <ChevronDownCircle
                    className={`h-5 w-5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                    stroke="white"
                  />
                </button>
              </div>
              <div className='flex items-center gap-4'>
                {/* <div className='text-right'>
                    <p className='text-lg font-semibold text-white'>
                      Rp. {selectedTimes.length * 60000}
                    </p>
                  </div> */}
                <Button
                  onClick={() => router.push('./payment')}
                  className='bg-orange-500 hover:bg-orange-600 px-8 py-3 font-semibold cursor-pointer'
                >
                  BAYAR
                </Button>
              </div>
            </div>

            {/* Dropdown details */}
            {showDetails && (
              <div className='mt-2 border-t pt-3'>
                <div className='space-y-2'>
                  {selectedTimes.map((timeKey, idx) => {
                    const [court, timeSlot] = timeKey.split('|');
                    return (
                      <div
                        key={idx}
                        className='flex items-center justify-between text-sm'
                      >
                        <div>
                          <p className='font-medium text-white'>{court}</p>
                          <p className='text-white'>{timeSlot}</p>
                        </div>
                        <p className='text-white'>Rp60.000</p>
                      </div>
                    );
                  })}
                </div>

                <div className='mt-3 flex justify-between border-t pt-3 text-white'>
                  <p className='font-bold'>Total</p>
                  <p className='font-bold'>
                    Rp. {selectedTimes.length * 60000}
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