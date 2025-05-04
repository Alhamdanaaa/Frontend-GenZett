/* eslint-disable no-console */
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
  policyAgreement: boolean
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
      paymentType: 'full',
      policyAgreement: false,
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
    },{
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

    console.log('Data yang dikirim:', payload)

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Gagal mengirim data')
      const result = await res.json()
      console.log('Respon dari server:', result)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const policyAgreed = watch('policyAgreement')
  const selectedPaymentType = watch('paymentType')
  const totalPayment = selectedPaymentType === 'dp' ? subtotal * 0.5 : subtotal

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between space-y-6 mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-24 md:px-48">
        {/* Ringkasan Pemesanan */}
        <div className="md:col-span-2 p-4 rounded-xl shadow bg-white space-y-2 text-black h-fit overflow-y-auto border-2 border-gray-200 border-opacity-75">
          <h2 className="font-semibold text-lg text-center">Ringkasan Pemesanan</h2>
          <BookingSummary bookings={bookings} location={location} />
          <PaymentTotal name="Harga" amount={subtotal} />
        </div>

        {/* Informasi Pembayaran */}
        <div className="md:col-span-1 p-4 rounded-xl shadow bg-white space-y-2 text-black h-fit border-2 border-gray-200 border-opacity-75 justify-between">
          <PayerInfo register={register} errors={errors} />

          <Controller
            control={control}
            name="paymentType"
            render={({ field }) => (
              <PaymentMethod selected={field.value} onSelect={field.onChange} />
            )}
          />

          <PaymentPolicy control={control} errors={errors} />
          <PaymentTotal name="Bayar" amount={totalPayment} />

          <div className="bottom-0 my-2 space-y-2">
            <PaymentAction disabled={!policyAgreed} />
            {!policyAgreed && (
              <p className="text-sm text-red-500 text-center">
                Anda harus menyetujui kebijakan lapangan terlebih dahulu.
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
