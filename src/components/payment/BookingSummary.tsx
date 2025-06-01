type BookingItem = {
  field: string,
  date: string,
  times: string[],
  price: number,
}

export default function BookingSummary({ location, bookings }: {
  location: string,
  bookings: BookingItem[]
}) {
  const totalTimes = bookings.reduce((total, booking) => total + booking.times.length, 0);

  return (
    <div className="">
      <div className="text-gray-600">
        <h2 className="font-semibold text-lg text-black">Lokasi Cabang : <br /> {location}</h2>
        <div className="mt-4 h-96 w- overflow-y-auto hide-scrollbar">
          {bookings.map((booking, index) => (
            <div key={`booking-${index}`} className="mb-4">
              <p className="m-2">{booking.field}</p>
              {booking.times.map((time, timeIdx) => (
                <div key={`time-${index}-${timeIdx}`} className="flex justify-between p-2 bg-gray-100 rounded mb-1">
                  <div>
                    <p>{booking.date}</p>
                    <p>{time}</p>
                  </div>
                  <span className="font-medium align-middle">Rp {booking.price.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center font-semibold text-lg m-0 p-0">
        <span>Total Jam</span>
        <span>{totalTimes} Jam</span>
      </div>
    </div>
  );
}
