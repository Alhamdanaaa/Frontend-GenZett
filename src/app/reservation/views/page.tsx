'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import UserLayout from '@/app/user/layout';
import { MapPin, Loader2 } from 'lucide-react';
import { getLocations, getSports } from '@/lib/api/reservation';
import { Location } from '@/constants/data';

export default function SportsLocationPage() {
  const router = useRouter();
  const [sports, setSports] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
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
        let sportData: string[] = [];
        const sportsResponse = await getSports();
        if (sportsResponse && sportsResponse.data) {
          if (Array.isArray(sportsResponse.data)) {
            // Direct array of strings
            sportData = sportsResponse.data.filter((sport: any) => typeof sport === 'string');
          }
        }
        setSports(sportData);

        const locationResponse = await getLocations({});
        // Ensure that locations are properly formatted with all required fields
        if (locationResponse.data && Array.isArray(locationResponse.data)) {
          setLocations(locationResponse.data);
        } else {
          setError('Invalid location data format received');
        }
      } catch (error) {
        console.error(`Gagal memuat data: `, error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  async function handleFilter() {
    setLoading(true);
    try {
      const response = await getLocations({sport: selectedSport});
      if (response.data && Array.isArray(response.data)) {
        setLocations(response.data);
      } else {
        setError('Invalid location data format received');
      }
    } catch (error) {
      console.error('Error filtering locations:', error);
      setError('Failed to filter locations');
    } finally {
      setLoading(false);
    }
  }

  const handleCardClick = (item: Location) => {
    if (item.locationId) {
      router.push(`/reservation/schedule?locationId=${item.locationId}`);
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
      Volleyball: '🏐'
    };
    return sportEmojiMap[sport] || '🎮';
  };

  return (
    <UserLayout>
      <main className='bg-white text-gray-800 overflow-auto hide-scrollbar'>
        <div className='mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-5 md:py-10'>
          <div className='mb-6 flex justify-center'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
              <div className='relative w-full sm:w-72' ref={sportDropdownRef}>
                <label
                  htmlFor='sport-type'
                  className='absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600'
                >
                  Cabang Olahraga
                </label>
                <button
                  type='button'
                  onClick={() => setIsOpen(!isOpen)}
                  className='w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none'
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
                className='rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition hover:bg-orange-600'
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
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
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
                          target.src = '/images/futsal.png';
                          target.onerror = null; // Prevent error loop
                        }}
                        unoptimized={process.env.NODE_ENV === 'development'}
                        className='rounded-t-xl'
                      />
                    </div>
                    <div className='flex min-h-[220px] flex-col justify-between p-4'>
                      <div>
                        <p className='mb-1 text-sm font-medium text-gray-500'>
                          Cabang
                        </p>
                        <h3 className='text-lg font-bold text-gray-800'>
                          {item.locationName || 'Unnamed Location'}
                        </h3>
                        <div className='mt-2 flex items-start gap-2 text-sm text-gray-600'>
                          <MapPin size={16} className='mt-0.5 flex-shrink-0' />
                          <p className='leading-snug'>{item.address || 'No address available'}</p>
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
                      <p className='mt-4 text-sm text-gray-600'>
                        <span className='text-base font-bold text-black'>
                          {item.address || 'No address available'}
                        </span>
                      </p>
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