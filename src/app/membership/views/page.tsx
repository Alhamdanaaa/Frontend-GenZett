/* eslint-disable no-console */
'use client';

import UserLayout from "@/app/user/layout";
import MemberCard from "@/components/member/MemberCard";
import { getSports } from "@/lib/api/sports";
import { getLocations } from "@/lib/api/location";
import { getMemberships } from "@/lib/api/membership";

import React, { useState, useRef, useEffect } from 'react';

export default function MembershipPage() {
    const [sports, setSports] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [memberships, setMemberships] = useState<any[]>([]);
    const [selectedSport, setSelectedSport] = useState<string>();
    const [selectedLocation, setSelectedLocation] = useState<string>();
    const [isSportOpen, setIsSportOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const sportDropdownRef = useRef<HTMLDivElement>(null);
    const locationDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const fetchData = async () => {
            try {
                // buat agar isloading true saat fetch data
                setIsLoading(true);
                const sportResponse = await getSports({});
                const sportsData = sportResponse.sports.map((item: any) => item.sportName);
                setSports(sportsData);

                const locationResponse = await getLocations({});
                const locationsData = locationResponse.locations.map((item: any) => item.locationName);
                setLocations(locationsData);

                const membershipResponse = await getMemberships({});
                setMemberships(membershipResponse.data);

                console.log('Sports:', sportsData);
                console.log('Locations:', locationsData);
                console.log('Memberships:', membershipResponse.data);
            } catch (error) {
                console.error('Gagal memuat data:', error);
            }
        };

        fetchData();
    }, []);

    async function handleFilter() {
        try {
            const membershipResponse = await getMemberships({
                sports: selectedSport,
                locations: selectedLocation
            });
            setMemberships(membershipResponse.data);
        } catch (error) {
            console.error('Gagal memfilter data:', error);
            // Optional: Tampilkan notifikasi error ke user
        }
    }

    const handleReset = async () => {
        setIsLoading(true);
        setSelectedSport(undefined);
        setSelectedLocation(undefined);
        try {
            const membershipResponse = await getMemberships({});
            setMemberships(membershipResponse.data);
        } catch (error) {
            console.error('Gagal mereset filter:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="text-gray-800 overflow-auto hide-scrollbar">
            <UserLayout>
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-5 md:py-10">
                    <div className="text-black px-4 sm:px-8 md:px-16 lg:px-24">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">Pilih Paket Membership Sesuai Kebutuhanmu</h1>
                        <p className="text-center text-sm sm:text-base text-gray-500 mb-6 md:mb-10 px-2">Dapatkan akses eksklusif dan berbagai keuntungan dengan paket membership kami!</p>
                    </div>
                    <div className='mb-6 w-full'>
                        <div className='flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-4'>
                            {/* Filter Sport */}
                            <div className='relative flex-1 min-w-[200px]' ref={sportDropdownRef}>
                                <label
                                    htmlFor='sport-type'
                                    className='absolute -top-2 left-3 bg-[#f8f8f8] px-1 text-sm text-gray-600'
                                >
                                    Cabang Olahraga
                                </label>
                                <button
                                    type='button'
                                    onClick={() => setIsSportOpen(!isSportOpen)}
                                    className='w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f8f8] px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none'
                                >
                                    {selectedSport || 'Pilih Olahraga'}
                                </button>
                                {isSportOpen && (
                                    <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md'>
                                        {sports.map((sport, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedSport(sport);
                                                    setIsSportOpen(false);
                                                }}
                                                className='cursor-pointer px-4 py-2 text-base text-gray-700 hover:bg-gray-100'
                                            >
                                                {sport}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Filter Location */}
                            <div className='relative flex-1 min-w-[200px]' ref={locationDropdownRef}>
                                <label
                                    htmlFor='location-type'
                                    className='absolute -top-2 left-3 bg-[#f8f8f8] px-1 text-sm text-gray-600'
                                >
                                    Lokasi
                                </label>
                                <button
                                    type='button'
                                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                                    className='w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f8f8] px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none'
                                >
                                    {selectedLocation || 'Pilih Lokasi'}
                                </button>
                                {isLocationOpen && (
                                    <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-md'>
                                        {locations.map((location, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedLocation(location);
                                                    setIsLocationOpen(false);
                                                }}
                                                className='cursor-pointer px-4 py-2 text-base text-gray-700 hover:bg-gray-100'
                                            >
                                                {location}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Filter and Reset Buttons */}
                            <div className='flex gap-4 w-full md:w-auto md:flex-1 min-w-[200px]'>
                                <button
                                    className='flex-1 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600'
                                    onClick={handleFilter}
                                >
                                    Filter
                                </button>
                                <button
                                    className='flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-300'
                                    onClick={handleReset}
                                >
                                    Reset
                                </button>
                            </div>
                            {/* View All Button - Full width on small screens */}
                            <div className="w-full md:flex-1 min-w-[200px]">
                                <button className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600">
                                    Lihat Semua
                                </button>
                            </div>
                        </div>
                    </div>
                    <MemberCard members={memberships} />
                </div>
            </UserLayout>
        </main>
    );
}
