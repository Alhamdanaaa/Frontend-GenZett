'use client'

import { useForm, Controller } from 'react-hook-form'
import PaymentMethod from './PaymentMethod'
import PaymentPolicy from './PaymentPolicy'
import BookingSummary from './BookingSummary'
import PaymentAction from './PaymentAction'
import PaymentTotal from './PaymentTotal'
import PayerInfo from './PayerInfo'

type Booking = {
  field: string
  date: string
  times: string[]
  pricePerSlot: number
}

type FormData = {
  name: string
  phone: string
  paymentType: 'dp' | 'full'
}

export default function PaymentDetailsSection() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: 'SpongeBob Squarepants',
      phone: '08123467890',
      paymentType: 'dp',
    },
  })
  const location = 'Bikini Bottom'
  const bookings: Booking[] = [
    {
      field: 'Lapangan 1',
      date: 'Minggu, 10 Maret 2025',
      times: ['19.00', '20.00'],
      pricePerSlot: 50000,
    },
    {
      field: 'Lapangan 2',
      date: 'Minggu, 10 Maret 2025',
      times: ['19.00', '20.00'],
      pricePerSlot: 60000,
    },
  ]

  const subtotal = bookings.reduce((total, item) => {
    return total + item.times.length * item.pricePerSlot
  }, 0)

  const onSubmit = async (data: FormData) => {
    const total = data.paymentType === 'dp' ? subtotal * 0.5 : subtotal
    const payload = {
      name: data.name,
      phone: data.phone,
      paymentType: data.paymentType,
      total,
      bookings,
    }

    // eslint-disable-next-line no-console
    console.log('Data yang dikirim:', payload)

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Gagal mengirim data')
      const result = await res.json()
      // eslint-disable-next-line no-console
      console.log('Respon dari server:', result)
    } catch (error) {
      // eslint-disable-next-line no-console 
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between min-h-screen space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 p-4 rounded-xl shadow bg-white space-y-2 text-black h-fit border-2 border-gray-200 border-opacity-75">
          <h2 className='font-semibold text-lg text-center '>Ringkasan Pemesanan</h2>
          <BookingSummary bookings={bookings} location={location} />
          <PaymentTotal name='Harga' amount={subtotal}></PaymentTotal>
        </div>

        <div className="space-y-6 p-4 rounded-xl shadow bg-white space-y-2 text-black h-fit border-2 border-gray-200 border-opacity-75">
          <PayerInfo register={register} errors={errors} />
          <Controller
            control={control}
            name="paymentType"
            render={({ field }) => (
              <PaymentMethod selected={field.value} onSelect={field.onChange} />
            )}
          />
          <PaymentPolicy />
          <PaymentTotal name='Bayar' amount={watch('paymentType') === 'dp' ? subtotal * 0.5 : subtotal} />
          <div className='bottom-0 my-2'>
            <PaymentAction />
          </div>
        </div>
      </div>
    </form>
  )
}
