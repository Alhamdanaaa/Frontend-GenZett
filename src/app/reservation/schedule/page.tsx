  'use client';

  import { useEffect, useState } from 'react';
  import Image from 'next/image';
  import { useRouter } from 'next/navigation';
  import { Button } from '@/components/ui/button';
  import { ChevronDownCircle } from 'lucide-react';
  import UserLayout from '@/app/user/layout'

  export default function ReservationPage() {
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
        <div className='min-h-screen bg-[#f9f9f9]' suppressHydrationWarning>
          <div className='mx-auto max-w-6xl px-4 py-6'>
            {/* Image & Price */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <Image
                src='/images/futsal.png'
                alt='Lapangan'
                width={600}
                height={400}
                className='w-full rounded-xl object-cover'
              />
              <div className='space-y-4 md:col-span-2'>
                <div className='rounded-xl bg-white p-4 shadow-md'>
                  <p className='text-sm text-gray-500'>Mulai dari</p>
                  <p className='text-xl font-bold text-black'>Rp 60,000</p>
                  <Button className='mt-3 w-full bg-orange-500 hover:bg-orange-600'>
                    Cek Ketersediaan
                  </Button>
                </div>
              </div>
            </div>

            {/* Date Picker */}
            <div className='mt-6'>
              <div className='mb-2 flex items-center gap-2'>
                <Image
                  src='/icons/arrow.svg'
                  alt='-'
                  width={24}
                  height={24}
                />
                <p className='text-2xl font-semibold text-black'>
                  Pilih Lapangan
                </p>
              </div>
              <div className='flex justify-between rounded-2xl bg-[#2C473A] px-6 py-4'>
                {dates.map(({ day, date, month }) => {
                  const isSelected = selectedDate === date;
                  return (
                    <div
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-[70px] cursor-pointer rounded-2xl py-3 text-center text-sm font-medium shadow-sm transition-all ${
                        isSelected ? 'bg-[#D5FF35]' : 'bg-[#2C473A]'
                      }`}
                    >
                      <div className={isSelected ? 'text-black' : 'text-[#A0A4A8]'}>
                        {day}
                      </div>
                      <div className={isSelected ? 'text-black' : 'text-white'}>
                        {date} {month}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dropdown Cabor */}
            <div className='mt-6'>
              <div className='flex items-center'>
                <div className='rounded-l-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm'>
                  Cabang Olahraga
                </div>
                <select
                  className='-ml-px rounded-r-lg border border-l-0 border-gray-300 bg-white p-3 text-sm text-gray-700 shadow-sm focus:border-lime-400 focus:ring focus:ring-lime-300'
                  onChange={(e) => console.log(e.target.value)}
                >
                  <option value=''>Pilih Cabang</option>
                  <option value='badminton'>Badminton</option>
                  <option value='sepakbola'>Sepakbola</option>
                  <option value='basket'>Basket</option>
                  <option value='renang'>Renang</option>
                </select>
              </div>
            </div>

            {/* Court Time Slots */}
            <div className='mt-8 space-y-6'>
              {['Lapangan 1', 'Lapangan 2'].map((court, index) => (
                <div key={index} className='rounded-xl bg-white p-4 shadow-sm'>
                  <div className='mb-4 flex items-center justify-between'>
                    <div>
                      <p className='text-lg font-semibold text-black'>{court}</p>
                      <p className='text-sm text-gray-600'>
                        Lapangan Badminton beralaskan karpet vinyl
                      </p>
                    </div>
                    <div className='relative'>
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === court ? null : court)
                        }
                        className='flex items-center gap-1 rounded-full bg-lime-400 px-3 py-1 text-sm font-semibold text-white hover:bg-lime-500'
                      >
                        {timeSlots.filter((slot) => !slot.booked).length} Jadwal
                        Tersedia
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className={`h-4 w-4 transition-transform ${openDropdown === court ? 'rotate-180' : ''}`}
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M19 9l-7 7-7-7'
                          />
                        </svg>
                      </button>

                      {/* Dropdown Content */}
                      {openDropdown === court && (
                        <div className='absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg'>
                          <div className='p-2'>
                            <p className='text-sm text-gray-700'>
                              Total Slot: {timeSlots.length}
                            </p>
                            <p className='text-sm text-gray-700'>
                              Tersedia:{' '}
                              {timeSlots.filter((slot) => !slot.booked).length}
                            </p>
                            <p className='text-sm text-gray-700'>
                              Terbooking:{' '}
                              {timeSlots.filter((slot) => slot.booked).length}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-6'>
                    {timeSlots.map((time, idx) => {
                      const key = `${court}|${time.time}`;
                      const isSelected = selectedTimes.includes(key);

                      return (
                        <button
                          key={idx}
                          onClick={() => !time.booked && handleTimeClick(key)}
                          disabled={time.booked}
                          className={`rounded-lg border px-3 py-2 text-center text-sm transition-all ${
                            time.booked
                              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                              : isSelected
                                ? 'border-lime-400 bg-lime-400 text-black'
                                : 'border-gray-300 bg-white hover:border-lime-300 hover:bg-lime-50'
                          }`}
                        >
                          <div className='mb-1 text-xs text-[#A0A4A8]'>
                            60 Menit
                          </div>
                          <div
                            className={`font-medium ${time.booked ? 'text-gray-400' : 'text-black'}`}
                          >
                            {time.time}
                          </div>
                          {/* Harga HARUS muncul di sini jika tidak booked! */}
                          <div
                            className={`text-xs font-medium ${
                              time.booked ? 'text-gray-500' : 'text-[#2C473A]'
                            }`}
                          >
                            {time.booked ? 'Booked' : 'Rp60.000'}
                          </div>
                        </button>
                      );
                    })}
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
                      className='flex items-center text-white-500 hover:text-white-600'
                      onClick={() => setShowDetails((prev) => !prev)}
                    >
                      <ChevronDownCircle
                        className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-white'>
                        Rp. {selectedTimes.length * 60000}
                      </p>
                    </div>
                    <Button className='bg-orange-500 hover:bg-orange-600'>
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
                              <p className='font-medium'>{court}</p>
                              <p className='text-gray-500'>{timeSlot}</p>
                            </div>
                            <p>Rp60.000</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className='mt-3 flex justify-between border-t pt-3'>
                      <p className='font-medium'>Total</p>
                      <p className='font-bold'>
                        Rp. {selectedTimes.length * 60000}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }
