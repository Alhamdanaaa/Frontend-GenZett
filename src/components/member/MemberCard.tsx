export default function MemberCard() {
    const packages = [
        {
            name: 'PAKET BRONZE',
            price: 150000,
            description: 'Pembelian Paket 1 Bulan',
            benefits: ['1x pertemuan gratis', 'Diskon 10% untuk pembelian selanjutnya'],
        },
        {
            name: 'PAKET SILVER',
            price: 500000,
            description: 'Pembelian Paket 1 Bulan',
            benefits: ['1x pertemuan gratis', 'Diskon 10% untuk pembelian selanjutnya'],
        },
        {
            name: 'PAKET GOLD',
            price: 1000000,
            description: 'Pembelian Paket 1 Bulan',
            benefits: ['1x pertemuan gratis', 'Diskon 10% untuk pembelian selanjutnya'],
        },
        {
            name: 'PAKET SILVER',
            price: 500000,
            description: 'Pembelian Paket 1 Bulan',
            benefits: ['1x pertemuan gratis', 'Diskon 10% untuk pembelian selanjutnya'],
        },
        {
            name: 'PAKET GOLD',
            price: 1000000,
            description: 'Pembelian Paket 1 Bulan',
            benefits: ['1x pertemuan gratis', 'Diskon 10% untuk pembelian selanjutnya'],
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-10 py-6">
            {packages.map((pkg, index) => (
                <div
                    key={index} className="border-2 border-green-900 rounded-xl bg-white px-10 py-6 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transform transition duration-300">
                    <div className="mb-4">
                        <h2 className="font-bold text-xl mb-2">{pkg.name}</h2>
                        <p className="text-gray-600 mb-2">{pkg.description}</p>
                        <p className="text-gray-600">Keuntungan:</p>
                        <ul className="text-sm text-gray-600 mb-4 list-disc list-inside">
                            {pkg.benefits.map((benefit, idx) => (
                                <li key={idx}>{benefit}</li>
                            ))}
                        </ul>

                        <p className="text-xl font-semibold text-black mb-4">
                            Rp {pkg.price.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <button className="bg-lime-400 text-black font-semibold py-2 rounded hover:bg-lime-500 transition border-2 border-lime-500 hover:border-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-opacity-50">
                        Pilih Paket
                    </button>
                </div>
            ))}
        </div>
    );
}
