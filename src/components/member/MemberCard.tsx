'use client';

import { useRouter } from 'next/navigation';

export default function MemberCard({ members = [] }: { members: any[] }) {
    const router = useRouter();

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

    const handleSelectPackage = (locationId: string, sportName: string, membershipId: string) => {
        router.push(`../reservation/schedule?locationId=${locationId}&sportName=${sportName}&membershipId=${membershipId}`);
    };

    // Function to calculate discounted price
    const calculateDiscountedPrice = (price: number, discount: string) => {
        // Convert discount percentage string to number (e.g., "15.00" → 15)
        const discountPercent = parseFloat(discount);
        // Calculate discounted price (price - (price * discount%))
        return price - (price * discountPercent / 100);
    };

    // Function to format price with IDR currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.length === 0 && (
                <div className="col-span-3 text-center text-gray-500">
                    Tidak ada data membership yang tersedia.
                </div>
            )}
            {members.map((member, index) => {
                // Calculate the discounted price
                const discountedPrice = calculateDiscountedPrice(member.price, member.discount);
                const weeklyPrice = discountedPrice;
                const originalWeeklyPrice = member.price;

                return (
                    <div
                        key={index}
                        className="border-1 border-gray-200 rounded-xl bg-gradient-to-b from-white to-gray-50 px-6 py-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-2 transform transition duration-300 ease-in-out"
                    >
                        <div className="mb-6">
                            <div className="text-center mb-6">
                                <h2 className="font-bold text-xl mb-2 text-gray-800 bg-gradient-to-r from-lime-300 to-lime-400 bg-clip-text">
                                    {member.name}
                                </h2>
                                <div className="h-1 w-20 bg-lime-400 mx-auto rounded-full"></div>
                            </div>
                            <div className="bg-white rounded-lg p-4 mb-4 shadow-inner border border-gray-100">
                                <div className="flex justify-between text-gray-700 mb-3">
                                    <span className='font-medium'>📍 <span className='font-normal'>{member.locationName}</span></span>
                                    <span className='font-medium'>{getSportEmoji(member.sportName)} <span className='font-normal'>{member.sportName}</span></span>
                                </div>
                                <p className="text-gray-600 font-medium mb-2">Keuntungan:</p>
                                <ul className="text-sm text-gray-600 mb-2 space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-lime-500 mr-2">✓</span>
                                        {member.description}
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-lime-500 mr-2">✓</span>
                                        Sekali Pemesanan {member.weeks} Minggu
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-lime-500 mr-2">✓</span>
                                        Potongan Harga: {parseFloat(member.discount)}%
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center my-4">
                                <p className="text-xs text-gray-500 mb-1">Harga mulai dari</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatPrice(weeklyPrice)}
                                    <span className="text-sm font-normal text-gray-500">/sesi</span>
                                </p>
                                {parseFloat(member.discount) > 0 && (
                                    <p className="text-sm text-gray-500 line-through">
                                        {formatPrice(originalWeeklyPrice)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleSelectPackage(member.locationId, member.sportName, member.membershipId)}
                            className="w-full bg-gradient-to-r from-lime-300 to-lime-400 text-black font-semibold py-3 rounded-lg hover:from-lime-500 hover:to-lime-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-opacity-50"
                        >
                            Pilih Paket
                        </button>
                    </div>
                );
            })}
        </div>
    );
}