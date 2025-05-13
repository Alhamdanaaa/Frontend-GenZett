'use client';

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState, useEffect, useRef } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import UserLayout from '@/app/user/layout'
import { MapPin } from 'lucide-react';

const dummyData = Array(6).fill({
  name: "ReSport Lowokwaru",
  address: "Jl. Kendal Sari Bar. No. 8, Tulusrejo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65141",
  price: "Rp. 100.000",
  imageUrl: "/images/futsal.png",
  sports: ["Badminton", "Basket"],
});

export default function SportsLocationPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sports = ["Futsal", "Basket", "Badminton", "Tenis", "Voli"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
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

  const handleCardClick = (item: any) => {
    router.push('/reservation/schedule');
  };

  return (
    <>
      <UserLayout>
        <main className="text-gray-800">
          <div className="px-4 py-5 md:py-10 flex flex-col items-center max-w-6xl mx-auto gap-8">
            {/* Filter */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Custom Dropdown */}
                <div className="relative w-full sm:w-[28rem]" ref={dropdownRef}>
                  <label
                    htmlFor="sport-type"
                    className="absolute -top-2 left-3 text-sm bg-[#f8f8f8] px-1 text-gray-600"
                  >
                    Cabang Olahraga
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full border border-gray-300 rounded-lg px-4 pt-3 pb-2 text-gray-600 text-base text-left bg-[#f8f8f8] appearance-none focus:outline-none"
                  >
                    {selectedSport || "Pilih Olahraga"}
                  </button>

                  {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-[#f8f8f8] border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto">
                      {sports.map((sport, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedSport(sport);
                            setIsOpen(false);
                          }}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-base"
                        >
                          {sport}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                  Filter
                </button>
              </div>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 cursor-pointer transition-all hover:shadow-xl"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="h-48 w-full relative">
                    <Image
                      src={item.imageUrl}
                      alt="Lapangan"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-xl"
                    />
                  </div>
                  <div className="p-4 min-h-[220px] flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1 font-medium">Cabang</p>
                      <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>

                      {/* Lokasi */}
                      <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <p className="leading-snug">{item.address}</p>
                      </div>

                      {/* Sport icons */}
                      <div className="flex flex-col gap-2 text-sm text-gray-700 mt-4">
                        {item.sports.map((sport: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, sportIdx: Key | null | undefined) => (
                          <div key={sportIdx} className="flex items-center gap-1">
                            <span className="w-5 h-5 flex items-center justify-center">
                              {sport === "Badminton" ? "🏸" : sport === "Basket" ? "🏀" : "🎮"}
                            </span>
                            <span>{sport}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Harga */}
                    <p className="text-sm text-gray-600 mt-4">
                      Mulai <span className="text-base text-black font-bold">{item.price}</span>/sesi
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </UserLayout>
    </>
  );
}