type BookingItem = {
  field: string,
  date: string,
  times: string[],
  pricePerSlot: number,
}

export default function BookingSummary({ location, bookings }: {
  location: string,
  bookings: BookingItem[]
}) {
  const totalTimes = bookings.reduce((total, booking) => {
    return total + booking.times.length;
  }, 0);
  return (
    <>
      <div className="text-gray-600">
        <h2 className="font-semibold text-lg text-black">Lokasi Cabang : <br /> {location}</h2>
        {bookings.map((booking, index) => (
          <>
            <p key={index} className="m-2">{booking.field}</p>
            {booking.times.map((time, indexTime) => (
              <>
                <div className="flex justify-between p-2 bg-gray-100 rounded">
                  <div key={indexTime}>
                    <p key={index}>{booking.date}</p>
                    <p>{time}</p>
                  </div>
                  <p key={index} className="font-medium">Rp {booking.pricePerSlot.toLocaleString('id-ID')}</p>
                </div>
              </>
            ))}
          </>
        ))}
      </div>
      <div className="flex justify-between items-center font-semibold text-lg m-0 p-0">
        <span>Total Jam</span>
        <span>{totalTimes} Jam</span>
      </div>
    </>
  )
}