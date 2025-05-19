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

    const sportDropdownRef = useRef<HTMLDivElement>(null);
    const locationDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const fetchData = async () => {
            try {
                const sportResponse = await getSports({});
                const sportsData = sportResponse.sports.map((item: any) => item.sportName);
                setSports(sportsData);

                const locationResponse = await getLocations({});
                const locationsData = locationResponse.locations.map((item: any) => item.name);
                setLocations(locationsData);

                const membershipResponse = await getMemberships({});
                setMemberships(membershipResponse.memberships);
            } catch (error) {
                console.error('Gagal memuat data:', error);
            }
        };

        fetchData();
    }, []);

    function handleFilter() {
        getMemberships({ sport: selectedSport, location: selectedLocation });
    }

    return (
        <div className="bg-gray-100 h-screen overflow-auto hide-scrollbar">
            <UserLayout>
                <main className="bg-white text-gray-800 min-h-screen overflow-hidden">
                    <div className=" text-black px-24 md:px-48">
                        <h1 className="text-2xl font-bold text-center mb-2">Pilih Paket Membership Sesuai Kebutuhanmu</h1>
                        <p className="text-center text-gray-500 mb-10">Dapatkan akses eksklusif dan berbagai keuntungan dengan paket membership kami!</p>
                    </div>
                    <div className='mb-6 flex justify-center'>
                        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
                            {/* Filter Sport */}
                            <div className='relative w-full sm:w-72' ref={sportDropdownRef}>
                                <label
                                    htmlFor='sport-type'
                                    className='absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600'
                                >
                                    Cabang Olahraga
                                </label>
                                <button
                                    type='button'
                                    onClick={() => setIsSportOpen(!isSportOpen)}
                                    className='w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none'
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
                            <div className='relative w-full sm:w-72' ref={locationDropdownRef}>
                                <label
                                    htmlFor='location-type'
                                    className='absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600'
                                >
                                    Lokasi
                                </label>
                                <button
                                    type='button'
                                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                                    className='w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none'
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
                            {/* Button Filter */}
                            <button
                                className='rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition hover:bg-orange-600'
                                onClick={handleFilter}
                            >
                                Filter
                            </button>
                        </div>
                    </div>
                    {/* <MemberCard members={memberships} /> */}
                    <MemberCard />
                </main>
            </UserLayout>
        </div>
    );
}
