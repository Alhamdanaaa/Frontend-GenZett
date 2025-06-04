/* eslint-disable no-console */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import UserLayout from '@/app/user/layout';
import { MapPin, Loader2, Wallet } from 'lucide-react';
import { getLocations, getSports, getMinimumPrice } from '@/lib/api/reservation';
import { Location } from '@/constants/data';
// import { useSession } from 'next-auth/react';

export default function SportsLocationPage() {
  const router = useRouter();
  // const { data: session, status } = useSession();
  type LocationWithMinPrice = Location & { minPrice?: string };

  const [sports, setSports] = useState<string[]>([]);
  const [locations, setLocations] = useState<LocationWithMinPrice[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sportDropdownRef.current &&
        !sportDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleEscape);
    } else {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch sports data
        const sportsResponse = await getSports();
        const sportData = sportsResponse?.data?.filter((sport: any) => typeof sport === 'string') || [];
        setSports(sportData);

        // Fetch locations with minimum prices
        const locationResponse = await getLocations({});
        if (locationResponse.data && Array.isArray(locationResponse.data)) {
          const locationsWithPrices = await Promise.all(
            locationResponse.data.map(async (location: { locationId: string | number; locationName: any; }) => {
              try {
                const priceResponse = await getMinimumPrice(location.locationId);
                console.log(priceResponse);
                return {
                  ...location,
                  minPrice: priceResponse.success ? priceResponse.minPrice : 'Harga tidak tersedia'
                };
              } catch (error) {
                console.error(`Failed to get price for ${location.locationName}`, error);
                return {
                  ...location,
                  minPrice: 'Harga tidak tersedia'
                };
              }
            })
          );
          setLocations(locationsWithPrices);
          console.log('Locations with prices:', locationsWithPrices);
        }
      } catch (error) {
        setError('Gagal memuat data lokasi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const response = await getLocations({ sport: selectedSport });
      if (response.data) {
        const filteredLocations = await Promise.all(
          response.data.map(async (location: { locationId: string | number; }) => {
            const priceResponse = await getMinimumPrice(location.locationId);
            return {
              ...location,
              minPrice: priceResponse.success ? priceResponse.minPrice : 'Harga tidak tersedia'
            };
          })
        );
        setLocations(filteredLocations);
      }
    } catch (error) {
      setError('Gagal memfilter lokasi');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (item: Location) => {
    const firstSport = item.sports[0];
    if (item.locationId) {
      router.push(`/reservation/schedule?locationId=${item.locationId}&sportName=${firstSport}`);
    } else {
      console.error('Location ID is undefined', item);
    }
  };

  const getSportEmoji = (sport: string) => {
    const sportEmojiMap: { [key: string]: string } = {
      Badminton: '🏸',
      Basketball: '🏀',
      Futsal: '⚽',
      Tennis: '🎾',
      Volleyball: '🏐',
      Handball: '🤾🏻',
      Sepakbola: '🥅',
    };
    return sportEmojiMap[sport] || '🎮';
  };

  return (
    <UserLayout>
      <main className='text-gray-800 overflow-auto hide-scrollbar'>
        <div className='mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-5 md:py-10'>
          <div className='mb-6 w-full max-w-full'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full'>
              <div className='relative flex-1' ref={sportDropdownRef}>
                <label
                  htmlFor='sport-type'
                  className='absolute -top-2 left-3 bg-[#f8f8f8] px-1 text-sm text-gray-600'
                >
                  Cabang Olahraga
                </label>
                <button
                  type='button'
                  onClick={() => setIsOpen(!isOpen)}
                  className='w-full appearance-none rounded-lg border border-gray-300 px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none'
                >
                  {selectedSport || 'Pilih Olahraga'}
                </button>
                {isOpen && (
                  <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md'>
                    {sports.map((sport, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedSport(sport);
                          setIsOpen(false);
                        }}
                        className='cursor-pointer px-4 py-2 text-base text-gray-700 hover:bg-gray-100'
                      >
                        {sport}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                className='rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition hover:bg-orange-600 sm:whitespace-nowrap'
                onClick={handleFilter}
              >
                Filter
              </button>
            </div>
          </div>

          {loading && (
            <div className='flex items-center justify-center p-10'>
              <Loader2 className='h-10 w-10 animate-spin text-orange-500' />
            </div>
          )}

          {error && !loading && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>
              {error}. Silakan coba lagi.
            </div>
          )}

          {!loading && !error && (
            <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {locations.length > 0 ? (
                locations.map((item, idx) => (
                  <div
                    key={idx}
                    className='cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-xl'
                    onClick={() => handleCardClick(item)}
                  >
                    <div className='relative h-48 w-full'>
                      <Image
                        src={item.imageUrl || '/images/futsal.png'}
                        alt='Lapangan'
                        layout='fill'
                        objectFit='cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/futsal.png'; // 
                          // target.src = `/images/${item.imageUrl || 'futsal.png'}`;
                          target.onerror = null;
                        }}
                        unoptimized={process.env.NODE_ENV === 'development'}
                        className='rounded-t-xl'
                      />
                    </div>
                    <div className='flex flex-col justify-between min-h-[220px] p-4'>
                      <div>
                        <p className='mb-1 text-sm font-medium text-gray-500'>
                          Cabang
                        </p>
                        <h3 className='text-lg font-bold text-gray-800'>
                          {item.locationName || 'Unnamed Location'}
                        </h3>
                        <div className='mt-2 flex items-start gap-2 text-sm text-gray-600'>
                          <MapPin size={16} className='mt-0.5 flex-shrink-0' />
                          <p className='leading-snug break-words'>{item.address || 'No address available'}</p>
                        </div>
                        <div className='mt-4 flex flex-col gap-2 text-sm text-gray-700'>
                          {item.sports && item.sports.length > 0 ? (
                            item.sports.map((sport, sportIdx) => (
                              <div
                                key={sportIdx}
                                className='flex items-center gap-1'
                              >
                                <span className='flex h-5 w-5 items-center justify-center'>
                                  {getSportEmoji(sport)}
                                </span>
                                <span>{sport}</span>
                              </div>
                            ))
                          ) : (
                            <div className='text-gray-500'>No sports available</div>
                          )}
                        </div>
                      </div>
                      <div className='mt-2 text-sm text-gray-600'>
                        {item.minPrice ? (
                          <div className='mt-2 flex items-center'>
                            {/* <span className='text-base text-gray-600'> */}
                              <div className='flex items-center gap-2'>
                                <Wallet size={16} className='flex-shrink-0' />
                                <span className='text-sm text-gray-500'>Mulai</span>
                                <p className='font-bold text-lg text-gray-800'>{item.minPrice}</p>
                              </div>
                              <span className='text-xs text-gray-500 self-end mb-1'>/sesi</span>
                            {/* </span> */}
                          </div>
                        ) : (
                          <div className='mt-2 text-sm text-gray-500'>Harga tidak tersedia</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-span-full p-10 text-center text-gray-500'>
                  Tidak ada lokasi ditemukan. Silakan coba filter lain.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </UserLayout>
  );
}