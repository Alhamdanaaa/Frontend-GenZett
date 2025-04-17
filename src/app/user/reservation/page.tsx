import Image from 'next/image'
import { Metadata } from 'next'

const dummyData = Array(6).fill({
  name: "ReSport Lowokwaru",
  address: "Jl. Kendal Sari Bar. No. 8, Tulusrejo, Kec. Lowokwaru, Kota Malang, Jawa Timur 65141",
  price: "Rp. 100.000",
  imageUrl: "/images/futsal.png",
  sports: ["Badminton", "Basket"],
});


export const metadata: Metadata = {
  title: 'Reservasi',
  description: 'Pemilihan lokasi dan olahraga',
}

export default function SportsLocationPage() {
  return (
    <div className="px-4 sm:px-6 py-10 max-w-7xl mx-auto">
      
      {/* Filter */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:w-[28rem]">
            <label
              htmlFor="sport-type"
              className="absolute -top-2 left-3 text-sm bg-white px-1 text-black"
            >
              Cabang Olahraga
            </label>
            <select
              id="sport-type"
              className="w-full border border-black rounded-lg px-4 pt-3 pb-2 text-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-black"
              defaultValue=""
            >
              <option value="" disabled hidden className="text-black">
                Pilih Olahraga
              </option>
              <option value="Futsal">Futsal</option>
              <option value="Basket">Basket</option>
              <option value="Badminton">Badminton</option>
              <option value="Tenis">Tenis</option>
              <option value="Voli">Voli</option>
            </select>
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
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
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
                <span>📍</span>
                <p className="leading-snug">{item.address}</p>
              </div>

              {/* Ikon olahraga */}
              <div className="flex flex-col gap-2 text-sm text-gray-700 mt-4">
                {item.sports.includes("Badminton") && (
                  <div className="flex items-center gap-2">
                    <span>🏸</span>
                    <span>Badminton</span>
                  </div>
                )}
                {item.sports.includes("Basket") && (
                  <div className="flex items-center gap-2">
                    <span>🏀</span>
                    <span>Basket</span>
                  </div>
                )}
              </div>
            </div>

            {/* Harga */}
            <p className="text-sm text-gray-600 mt-4">
              Mulai <span className="text-black font-bold">{item.price}</span>/sesi
            </p>
          </div>

        </div>
      ))}
    </div>
    </div>
  );
}
