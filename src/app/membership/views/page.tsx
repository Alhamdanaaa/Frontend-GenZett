/* eslint-disable no-console */
'use client';

import UserLayout from "@/app/user/layout";
import MemberCard from "@/components/member/MemberCard";
import { getSports } from "@/lib/api/sports";
import { getLocations } from "@/lib/api/location";
import { getMemberships } from "@/lib/api/membership";
import React, { useState, useRef, useEffect } from 'react';
import { getMinimumPriceLocSports } from "@/lib/api/reservation";

export default function MembershipPage() {
    const [sports, setSports] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [memberships, setMemberships] = useState<any[]>([]);
    const [selectedSport, setSelectedSport] = useState<string>();
    const [selectedLocation, setSelectedLocation] = useState<string>();
    const [isSportOpen, setIsSportOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [allMemberships, setAllMemberships] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 9;
    const backendLimit = 10;

    const sportDropdownRef = useRef<HTMLDivElement>(null);
    const locationDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [sportResponse, locationResponse, membershipResponse] = await Promise.all([
                    getSports({}),
                    getLocations({}),
                    getMemberships({ page: 1, limit: backendLimit })
                ]);

                setSports(sportResponse.sports.map((item: any) => item.sportName));
                setLocations(locationResponse.locations.map((item: any) => item.locationName));

                const membershipsWithPrice = await processMemberships(membershipResponse.data);
                setMemberships(membershipsWithPrice);
                setAllMemberships(membershipsWithPrice);
                setHasMore(membershipResponse.data.length >= backendLimit);
            } catch (error) {
                console.error('Gagal memuat data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const processMemberships = async (members: any[]) => {
        return await Promise.all(
            members.slice(0, limit).map(async (member: any) => {
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
    async function handleFilter() {
        try {
            setIsLoading(true);
            setPage(1);
            const membershipResponse = await getMemberships({
                page: 1,
                limit: backendLimit,
                sports: selectedSport,
                locations: selectedLocation
            });

            const membershipsWithPrice = await processMemberships(membershipResponse.data);
            setMemberships(membershipsWithPrice);
            setHasMore(membershipResponse.data.length >= backendLimit);
        } catch (error) {
            console.error('Gagal memfilter data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleReset = async () => {
        try {
            setIsLoading(true);
            setPage(1);
            setSelectedSport(undefined);
            setSelectedLocation(undefined);
            const membershipResponse = await getMemberships({ page: 1, limit: backendLimit });

            const membershipsWithPrice = await processMemberships(membershipResponse.data);
            setMemberships(membershipsWithPrice);
            setHasMore(membershipResponse.data.length >= backendLimit);
        } catch (error) {
            console.error('Gagal mereset filter:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowAll = async () => {
        if (showAll) {
            setShowAll(false);
            return;
        }

        try {
            setIsLoading(true);
            // Load all memberships without filters
            const response = await getMemberships({ page: 1, limit: backendLimit });
            const allData = await processMemberships(response.data);

            setAllMemberships(allData);
            setShowAll(true);
            setHasMore(response.data.length >= backendLimit);
            setPage(2); // Prepare for next page if needed
        } catch (error) {
            console.error('Failed to load all memberships:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = async () => {
        try {
            setIsLoading(true);
            const response = await getMemberships({
                page,
                limit: backendLimit,
                sports: selectedSport,
                locations: selectedLocation
            });

            const newMembers = await processMemberships(response.data);

            if (showAll) {
                setAllMemberships(prev => [...prev, ...newMembers]);
            } else {
                setMemberships(prev => [...prev, ...newMembers]);
            }

            setPage(prev => prev + 1);
            setHasMore(response.data.length >= backendLimit);
        } catch (error) {
            console.error('Failed to load more memberships:', error);
        } finally {
            setIsLoading(false);
        }
    };



    // Close dropdown when clicking outside
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
                    <div className="text-black px-4 md:px-24 lg:px-48">
                        <h1 className="text-2xl font-bold text-center mb-2">Pilih Paket Membership Sesuai Kebutuhanmu</h1>
                        <p className="text-center text-gray-500 mb-10">Dapatkan akses eksklusif dan berbagai keuntungan dengan paket membership kami!</p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className='mb-6 px-4'>
                                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-center md:gap-4'>
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
                                    <div className='flex gap-2 w-full md:w-auto'>
                                        <button
                                            className='flex-1 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 md:px-6'
                                            onClick={handleFilter}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Memproses...' : 'Filter'}
                                        </button>
                                        <button
                                            className='flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-300 md:px-6'
                                            onClick={handleReset}
                                            disabled={isLoading}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <MemberCard members={showAll ? allMemberships : memberships} />

                            <div className="flex justify-center mt-10 pb-10">
                                {hasMore && (
                                    <button
                                        className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white transition hover:bg-orange-600"
                                        onClick={showAll ? handleLoadMore : handleShowAll}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Memuat...' : showAll ? 'Muat Lebih Banyak' : 'Lihat Semua Paket Membership'}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </UserLayout>
        </main>
    );
}