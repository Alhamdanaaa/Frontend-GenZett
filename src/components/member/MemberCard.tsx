'use client';

import { useRouter } from 'next/navigation';

export default function MemberCard({ members = []}: {members: any[] }) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 py-6">
            {members.map((member, index) => (
                <div
                    key={index} className="border-2 border-gray-300 rounded-xl bg-[#f8f8f8] px-10 py-6 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transform transition duration-300">
                    <div className="mb-4">
                        <h2 className="font-bold text-xl mb-2">{member.name}</h2>
                        <p className="text-gray-600 mb-2">{member.description}</p>
                        <p className="text-gray-600">Keuntungan:</p>
                        <ul className="text-sm text-gray-600 mb-4 list-disc list-inside">
                            <li>{member.description}</li>
                            <li>{member.description}</li>
                            <li>{member.description}</li>
                        </ul>

                        <p className="text-xl font-semibold text-black mb-4">
                            Rp {member.price.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <button 
                    onClick={() =>
                        router.push('../reservation/schedule')
                    }
                    className="bg-lime-400 text-black font-semibold py-2 rounded hover:bg-lime-500 transition hover:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-opacity-50"
                    >
                        Pilih Paket
                    </button>
                </div>
            ))}
        </div>
    );
}
