/* eslint-disable no-console */
'use client';

import UserLayout from "@/app/user/layout";
import MemberCard from "@/components/member/MemberCard";
import { getSports } from "@/lib/api/sports";
import { getLocations } from "@/lib/api/location";
import { getMemberships } from "@/lib/api/membership";
import React, { useState, useRef, useEffect } from 'react';
import { getMinimumPriceLocSports } from "@/lib/api/reservation";
import { Loader2 } from 'lucide-react';

export default function MembershipPage() {
    const [sports, setSports] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [memberships, setMemberships] = useState<any[]>([]);
    const [selectedSport, setSelectedSport] = useState<string>();
    const [selectedLocation, setSelectedLocation] = useState<string>();
    const [isSportOpen, setIsSportOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [allMemberships, setAllMemberships] = useState<any[]>([]);

    const sportDropdownRef = useRef<HTMLDivElement>(null);
    const locationDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const [sportResponse, locationResponse, membershipResponse] = await Promise.all([
                    getSports({}),
                    getLocations({}),
                    getMemberships({}) // Tanpa all=true untuk initial load
                ]);

                setSports(sportResponse.sports.map((item: any) => item.sportName));
                setLocations(locationResponse.locations.map((item: any) => item.locationName));

                const initialMembers = membershipResponse.data.slice(0, 9);
                const membershipsWithPrice = await processMemberships(initialMembers);
                setMemberships(membershipsWithPrice);
            } catch (error) {
                console.error('Gagal memuat data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const processMemberships = async (members: any[]) => {
        return await Promise.all(
            members.map(async (member: any) => {
                try {
                    const priceData = await getMinimumPriceLocSports(
                        member.locationId,
                        member.sportName
                    );
                    return {
                        ...member,
                        price: priceData.minPrice,
                        formattedPrice: new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(priceData.minPrice || 0)
                    };
                } catch (error) {
                    console.error('Failed to get price for membership:', error);
                    return {
                        ...member,
                        price: 0,
                        formattedPrice: new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(0)
                    };
                }
            })
        );
    };

    const handleFilter = async () => {
        try {
            setIsFiltering(true);
            setShowAll(false);
            const membershipResponse = await getMemberships({
                sports: selectedSport,
                locations: selectedLocation
            });

            const initialMembers = membershipResponse.data.slice(0, 9);
            const membershipsWithPrice = await processMemberships(initialMembers);
            setMemberships(membershipsWithPrice);
        } catch (error) {
            console.error('Gagal memfilter data:', error);
        } finally {
            setIsFiltering(false);
        }
    };

    const handleReset = async () => {
        try {
            setIsFiltering(true);
            setShowAll(false);
            setSelectedSport(undefined);
            setSelectedLocation(undefined);
            const membershipResponse = await getMemberships({});

            const initialMembers = membershipResponse.data.slice(0, 9);
            const membershipsWithPrice = await processMemberships(initialMembers);
            setMemberships(membershipsWithPrice);
        } catch (error) {
            console.error('Gagal mereset filter:', error);
        } finally {
            setIsFiltering(false);
        }
    };

    const handleShowAll = async () => {
        if (showAll) {
            setShowAll(false);
            return;
        }

        try {
            setIsLoadingAll(true);
            // Menggunakan all=true untuk mengambil semua data
            const membershipResponse = await getMemberships({
                all: true,
                sports: selectedSport,
                locations: selectedLocation
            });

            const allMembershipsWithPrice = await processMemberships(membershipResponse.data);
            setAllMemberships(allMembershipsWithPrice);
            setShowAll(true);
        } catch (error) {
            console.error('Gagal memuat semua data:', error);
        } finally {
            setIsLoadingAll(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target as Node)) {
                setIsSportOpen(false);
            }
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
                setIsLocationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <main className="text-gray-800 overflow-auto hide-scrollbar">
            <UserLayout>
                <main className="text-gray-800 min-h-screen overflow-hidden">
                    <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-5 md:py-10">
                        <div className="w-full">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pilih Paket Langganan Sesuai Kebutuhanmu</h1>
                            <p className="text-gray-600 mb-6">Dapatkan akses eksklusif dan berbagai keuntungan dengan paket langganan kami!</p>
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
                                        className='w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f8f8] px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500'
                                    >
                                        {selectedSport || 'Pilih Olahraga'}
                                    </button>
                                    {isSportOpen && (
                                        <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-[#f8f8f8] shadow-md'>
                                            {sports.map((sport, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedSport(sport);
                                                        setIsSportOpen(false);
                                                    }}
                                                    className='cursor-pointer px-4 py-2 hover:bg-orange-50 text-base text-gray-700 hover:bg-gray-100'
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
                                        className='w-full appearance-none rounded-lg border border-gray-300 bg-[#f8f8f8] px-4 pt-3 pb-2 text-left text-base text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500'
                                    >
                                        {selectedLocation || 'Pilih Lokasi'}
                                    </button>
                                    {isLocationOpen && (
                                        <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-[#f8f8f8] shadow-md'>
                                            {locations.map((location, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedLocation(location);
                                                        setIsLocationOpen(false);
                                                    }}
                                                    className='cursor-pointer px-4 py-2 hover:bg-orange-50 text-base text-gray-700 hover:bg-gray-100'
                                                >
                                                    {location}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Button Filter */}
                                <div className='flex gap-4 w-full md:w-auto md:flex-1 min-w-[200px]'>
                                    <button
                                        className='flex-1 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 md:px-6'
                                        onClick={handleFilter}
                                        disabled={isFiltering}
                                    >
                                        {isFiltering ? 'Memproses...' : 'Filter'}
                                    </button>
                                    <button
                                        className='flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-300 md:px-6'
                                        onClick={handleReset}
                                        disabled={isFiltering}
                                    >
                                        Reset
                                    </button>
                                </div>

                                {/* Show All Button */}
                                <div className="w-full md:flex-1 min-w-[200px]">
                                    <button
                                        className="w-full rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition hover:bg-orange-600"
                                        onClick={handleShowAll}
                                        disabled={isLoadingAll}
                                    >
                                        {isLoadingAll ? 'Memuat...' : showAll ? 'Tampilkan Sedikit' : 'Lihat Semua'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className='flex flex-col items-center justify-center p-10 gap-4'>
                                <Loader2 className='h-10 w-10 animate-spin text-orange-500' />
                                <p className='text-gray-600'>Memuat Paket Langganan...</p>
                            </div>
                        ) : (
                            <>
                                {(isFiltering || isLoadingAll) && (
                                    <div className='flex justify-center mb-4'>
                                        <Loader2 className='h-6 w-6 animate-spin text-orange-500' />
                                    </div>
                                )}
                                <MemberCard members={showAll ? allMemberships : memberships} />
                            </>
                        )}
                    </div>
                </main>
            </UserLayout>
        </main>
    );
}