/* eslint-disable no-console */
'use client'

import { useForm, Controller } from 'react-hook-form'
import BookingSummary from './BookingSummary'
import PaymentTotal from './PaymentTotal'
import PayerInfo from './PayerInfo'
import PaymentMethod from './PaymentMethod'
import PaymentPolicy from './PaymentPolicy'
import PaymentAction from './PaymentAction'
import { createReservation } from '@/lib/api/reservation'
import { useRouter } from 'next/navigation'
import { getUserById } from '@/lib/api/user'
import { useEffect, useState } from 'react'

type Booking = {
  field: string
  date: string
  times: string[]
  pricePerSlot: number
}

type Props = {
  data: {
    bookings: Booking[]
    location: string
    subtotal: number
  }
}

type FormData = {
  name: string
  phone: string
  paymentType: 'dp' | 'full'
  policyAgreement: boolean
}

export default function PaymentDetailsSection({ data }: Props) {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ name: string; phone: string }>({ name: '', phone: '' })

  useEffect(() => {
    const currentUserId = localStorage.getItem('userId')
    if (currentUserId) {
      setUserId(currentUserId)
      getUserById(parseInt(currentUserId))
        .then((user) => {
          if (user) {
            setUserData({ name: user.name, phone: user.phone })
          } else {
            console.error('User not found')
          }
        })
        .catch((err) => {
          console.error('Error fetching user data:', err)
        })
    } else {
      console.error('No user ID found in localStorage')
    }
  }, [])

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: userData.name,
      phone: userData.phone,
      paymentType: 'full',
      policyAgreement: false,
    },
    values: {
      name: userData.name,
      phone: userData.phone,
      paymentType: 'full',
      policyAgreement: false,
    },
  })

  const policyAgreed = watch('policyAgreement')
  const selectedPaymentType = watch('paymentType')
  const totalPayment = selectedPaymentType === 'dp' ? data.subtotal * 0.5 : data.subtotal

  const onSubmit = async (formData: FormData) => {
    const currentUserId = localStorage.getItem('userId')

    const payload = {
      userId: currentUserId,
      name: formData.name,
      phone: formData.phone,
      paymentType: formData.paymentType,
      total: totalPayment,
      fieldData: data.bookings.map((booking) => ({
        fieldId: parseInt(booking.field), // sesuaikan jika ini ID string
        fieldName: booking.field,
        timeIds: booking.times.map((t) => parseInt(t)),
        times: booking.times,
        dates: [booking.date],
      })),
    }

    try {
      const res = await createReservation(payload)
      if (res?.invoice_url) {
        router.push(res.invoice_url)
      } else {
        alert('Gagal membuat invoice')
        console.error('Response tidak mengandung invoice_url:', res)
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat membuat reservasi')
      console.error('Error creating reservation:', err)

    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between space-y-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-24 md:px-48">
        <div className="md:col-span-2 p-4 rounded-xl shadow bg-white space-y-2 text-black h-fit overflow-y-auto border-2 border-gray-200 border-opacity-75">
          <h2 className="font-semibold text-lg text-center">Ringkasan Pemesanan</h2>
          <BookingSummary bookings={data.bookings} location={data.location} />
          <PaymentTotal name="Harga" amount={data.subtotal} />
        </div>

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
