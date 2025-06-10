/* eslint-disable no-console */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import UserLayout from '@/app/user/layout';
import { MapPin, Loader2, Wallet, ChevronDown, FilterX } from 'lucide-react';
import { getLocations, getSports, getPrice } from '@/lib/api/reservation';
import { Location } from '@/constants/data';

export default function SportsLocationPage() {
  const router = useRouter();
  type LocationWithPrice = Location & { minPrice?: string, maxPrice?: string, img?: string, imageUrl?: string };

  const [sports, setSports] = useState<string[]>([]);
  const [locations, setLocations] = useState<LocationWithPrice[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sportDropdownRef = useRef<HTMLDivElement>(null);

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
        const sportsResponse = await getSports();
        const sportData = sportsResponse?.data?.filter((sport: any) => typeof sport === 'string') || [];
        setSports(sportData);

        const locationResponse = await getLocations({});
        if (locationResponse.data && Array.isArray(locationResponse.data)) {
          const locationsWithDetails = await Promise.all(
            locationResponse.data.map(async (location: any) => {
              try {
                const priceResponse = await getPrice(location.locationId);
                const minPrice = priceResponse.success ? priceResponse.minPrice : 'N/A';
                const maxPrice = priceResponse.success ? priceResponse.maxPrice : 'N/A';

                const storageBaseUrl = process.env.NEXT_PUBLIC_AZURE_BLOB_URL;
                const imageUrl = location.imageUrl ? (() => {
                  try {
                    const url = new URL(location.imageUrl);
                    const filename = url.pathname.split('/').pop();
                    if (!filename) return null;

                    const fullUrl = `${storageBaseUrl}/${filename}`;
                    return fullUrl;
                  } catch (e) {
                    console.error("Error parsing imageUrl:", e);
                    return null;
                  }
                })() : null;

                return {
                  ...location,
                  minPrice: minPrice,
                  maxPrice: maxPrice,
                  imageUrl,
                };

              } catch (error) {
                console.error(`Failed to get price for ${location.locationName}`, error);
                return {
                  ...location,
                  minPrice: 'N/A',
                  maxPrice: 'N/A',
                  imageUrl: null,
                };
              }
            })
          );

          setLocations(locationsWithDetails);
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
      const storageBaseUrl = process.env.NEXT_PUBLIC_AZURE_BLOB_URL;
      if (response.data) {
        const filteredLocations = await Promise.all(
          response.data.map(async (location: { locationId: string | number; imageUrl: string }) => {
            const priceResponse = await getPrice(location.locationId);
            let imageUrl = null;
            try {
              const url = new URL(location.imageUrl);
              const filename = url.pathname.split('/').pop();
              if (filename) {
                imageUrl = `${storageBaseUrl}/${filename}`;
              }
            } catch (e) {
              console.error("Error parsing imageUrl during filtering:", e);
            }

            return {
              ...location,
              minPrice: priceResponse.success ? priceResponse.minPrice : 'N/A',
              maxPrice: priceResponse.success ? priceResponse.maxPrice : 'N/A',
              imageUrl,
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

  const clearFilter = () => {
    setSelectedSport('');
    setLoading(true);
    const storageBaseUrl = process.env.NEXT_PUBLIC_AZURE_BLOB_URL;
    getLocations({}).then(response => {
      if (response.data) {
        Promise.all(
          response.data.map(async (location: { locationId: string | number; imageUrl?: string }) => {
            const priceResponse = await getPrice(location.locationId);
            const parsedImageUrl = location.imageUrl ? (() => {
              try {
                const url = new URL(location.imageUrl);
                const filename = url.pathname.split('/').pop();
                if (!filename) return null;
                return `${storageBaseUrl}/${filename}`;
              } catch (e) {
                console.error("Error parsing imageUrl:", e);
                return null;
              }
            })() : null;
            return {
              ...location,
              minPrice: priceResponse.success ? priceResponse.minPrice : 'N/A',
              maxPrice: priceResponse.success ? priceResponse.maxPrice : 'N/A',
              imageUrl:parsedImageUrl
            };
          })
        ).then(locationsWithPrices => {
          setLocations(locationsWithPrices);
          setLoading(false);
        });
      }
    });
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
      'Sepak Bola': '🥅',
    };
    return sportEmojiMap[sport] || '🎮';
  };

  return (
    <UserLayout>
      <main className='text-gray-800 overflow-auto hide-scrollbar bg-gray-50'>
        <div className='mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-5 md:py-10'>
          <div className='w-full'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>Temukan Lapangan Olahraga</h1>
            <p className='text-gray-600 mb-6'>Pilih cabang olahraga dan temukan lapangan terbaik di sekitar Anda</p>

            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full mb-8'>
              <div className='relative flex-1' ref={sportDropdownRef}>
                <label
                  htmlFor='sport-type'
                  className='absolute -top-2 left-3 bg-[#f8f8f8] px-2 text-sm text-gray-600 z-10 rounded-md'
                >
                  Cabang Olahraga
                </label>
                <button
                  type='button'
                  onClick={() => setIsOpen(!isOpen)}
                  className='w-full appearance-none rounded-lg border border-gray-300 px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-[#f8f8f8] flex justify-between items-center'
                >
                  <span>{selectedSport || 'Semua Olahraga'}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className='absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-[#f8f8f8] shadow-lg'>
                    <div
                      onClick={() => {
                        setSelectedSport('');
                        setIsOpen(false);
                      }}
                      className='cursor-pointer px-4 py-2 text-base text-gray-700 hover:bg-gray-100 border-b border-gray-100'
                    >
                      Semua Olahraga
                    </div>
                    {sports.map((sport, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedSport(sport);
                          setIsOpen(false);
                        }}
                        className='cursor-pointer px-4 py-2 text-base text-gray-700 hover:bg-orange-50 flex items-center gap-2'
                      >
                        <span className='text-lg'>{getSportEmoji(sport)}</span>
                        <span>{sport}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                className='rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 sm:whitespace-nowrap flex items-center gap-2 shadow-md hover:shadow-lg'
                onClick={handleFilter}
              >
                <FilterX className='h-4 w-4' />
                <span>Filter</span>
              </button>
              {selectedSport && (
                <button
                  className='rounded-lg border px-4 py-3 font-semibold text-gray-700 transition bg-gray-200 hover:bg-gray-300 sm:whitespace-nowrap flex items-center gap-2'
                  onClick={clearFilter}
                >
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {loading && (
            <div className='flex flex-col items-center justify-center p-10 gap-4'>
              <Loader2 className='h-10 w-10 animate-spin text-orange-500' />
              <p className='text-gray-600'>Memuat data lapangan...</p>
            </div>
          )}

          {error && !loading && (
            <div className='rounded-lg bg-red-100 p-4 text-red-600 border border-red-200 w-full max-w-md text-center'>
              {error}. Silakan coba lagi.
            </div>
          )}

          {!loading && !error && (
            <div className='w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {locations.length > 0 ? (
                locations.map((item, idx) => (
                  <div
                    key={idx}
                    className='cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-xl hover:translate-y-[-4px] group'
                    onClick={() => handleCardClick(item)}
                  >
                    <div className='relative h-48 w-full'>
                      <Image
                        src={item.imageUrl || '/images/futsal.png'}
                        alt={item.locationName || 'Location Image'}
                        layout="fill"
                        objectFit="cover"
                        unoptimized={process.env.NODE_ENV === 'development'}
                        className="rounded-t-xl"
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-xl' />
                      <div className='absolute bottom-4 left-4'>
                        <h3 className='text-xl font-bold text-white drop-shadow-md'>
                          {item.locationName || 'Unnamed Location'}
                        </h3>
                      </div>
                    </div>
                    <div className='p-5'>
                      <div className='flex items-start gap-3 text-sm text-gray-600 mb-4'>
                        <MapPin size={18} className='mt-0.8 flex-shrink-0 text-orange-500' />
                        <p className='leading-snug break-words'>{item.address || 'Alamat tidak tersedia'}</p>
                      </div>

                      <div className='mb-4'>
                        <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2'>Cabang Olahraga</p>
                        <div className='flex flex-wrap gap-2'>
                          {item.sports && item.sports.length > 0 ? (
                            item.sports.map((sport, sportIdx) => (
                              <span
                                key={sportIdx}
                                className='inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full text-sm'
                              >
                                <span className='text-base'>{getSportEmoji(sport)}</span>
                                <span>{sport}</span>
                              </span>
                            ))
                          ) : (
                            <span className='text-gray-500 text-sm'>Tidak tersedia</span>
                          )}
                        </div>
                      </div>

                      <div className='border-t border-gray-200 pt-4'>
                        <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2'>Harga Sewa</p>
                        {item.minPrice !== 'N/A' ? (
                          <div className='flex items-center gap-2'>
                            <Wallet size={18} className='flex-shrink-0 text-orange-500' />
                            <div>
                              <p className='text-sm text-gray-600'>Mulai dari</p>
                              <p className='font-bold text-lg text-gray-800'>
                                {item.minPrice} {item.maxPrice !== item.minPrice && `- ${item.maxPrice}`}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className='text-sm text-gray-500'>Harga tidak tersedia</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-span-full p-10 text-center'>
                  <div className='bg-gray-100 rounded-xl p-8 max-w-md mx-auto'>
                    <Image
                      src="/images/no-results.svg"
                      alt="No results"
                      width={200}
                      height={200}
                      className='mx-auto mb-4'
                    />
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Tidak ada lokasi ditemukan</h3>
                    <p className='text-gray-600 mb-4'>Silakan coba filter lain atau reset filter Anda</p>
                    <button
                      onClick={clearFilter}
                      className='rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition hover:bg-orange-600'
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </UserLayout>
  );
}