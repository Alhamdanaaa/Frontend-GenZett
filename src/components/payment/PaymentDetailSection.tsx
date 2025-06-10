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
  fieldId: string
  field: string
  date: string
  times: string[]
  timeIds: string[]
  price: number
}

type Props = {
  data: {
    bookings: Booking[]
    location: string
    total: number
    subtotal: number
    discount: number
    paymentType: 'reguler' | 'membership'
    userId: string
    membershipId?: string | null
  }
}

type Payload = {
  userId: number,
  name: string,
  paymentStatus: string,
  paymentType: string,
  total: number,
  details: {
    fieldId: number,
    timeIds: number[],
    date: string
  }[],
  membershipId?: number
}

type FormData = {
  name: string
  phone: string
  paymentType: 'dp' | 'full'
  policyAgreement: boolean
}

export default function PaymentDetailsSection({ data }: Props) {
  const router = useRouter()
  const [userData, setUserData] = useState<{ name: string; phone: string }>({ name: '', phone: '' })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserById(parseInt(data.userId))
        if (user) {
          setUserData({ name: user.name ?? '', phone: user.phone ?? '' })
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }

    if (data.userId) {
      fetchUserData()
    }
  }, [data.userId])

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      paymentType: 'full',
      policyAgreement: false,
    }
  })

  useEffect(() => {
    reset({
      name: userData.name,
      phone: userData.phone,
      paymentType: 'full',
      policyAgreement: false,
    })
  }, [userData, reset])

  const policyAgreed = watch('policyAgreement')
  const selectedPaymentType = watch('paymentType')
  const totalPayment = data.paymentType === 'membership' || selectedPaymentType !== 'dp'
    ? data.total
    : data.total * 0.5

  const onSubmit = async (formData: FormData) => {
    console.log('Isi data.bookings (diformat):', JSON.stringify(data.bookings, null, 2))

    if (!data.userId) {
      console.error('User ID tidak ditemukan');
      return;
    }

    if (!data.bookings || data.bookings.length === 0) {
      alert('Tidak ada data booking yang dipilih');
      return;
    }

    const userIdNumber = parseInt(data.userId);
    if (isNaN(userIdNumber)) {
      console.error('User ID tidak valid');
      return;
    }

    const payload: Payload = {
      userId: userIdNumber,
      name: formData.name,
      paymentStatus: "pending",
      paymentType: data.paymentType,
      total: totalPayment,
      details: data.bookings.map(booking => ({
        fieldId: parseInt(booking.fieldId),
        timeIds: booking.timeIds.map(id => parseInt(id)),
        date: booking.date
      })),
      ...(data.paymentType === 'membership' && data.membershipId && {
        membershipId: parseInt(data.membershipId)
      })
    };

    console.log('Payload yang dikirim:', payload);

    try {
      const res = await createReservation(payload);
      console.log('Response yang diterima: ', res.payment);
      const invoiceUrl = res.payment.payment?.xendit_invoice_url;
      console.log('Invoice URL:', invoiceUrl);
      if (invoiceUrl) {
        router.push(invoiceUrl);
      } else {
        throw new Error('Response tidak mengandung invoice_url');
      }
      console.log(res);
    } catch (err) {
      const errorMessage = (err as any)?.message || 'Terjadi kesalahan';
      const errorResponse = (err as any)?.response?.data;
      console.error('Error detail:', {
        message: errorMessage,
        response: errorResponse
      });
      alert(`Gagal membuat reservasi: ${errorResponse?.message || errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between space-y-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 lg:px-24">
        <div className="md:col-span-2 p-4 rounded-xl shadow bg-white space-y-2 text-black border-1 border-gray-200 self-start">
          <h2 className="font-semibold text-lg text-center">Ringkasan Pemesanan</h2>
          <BookingSummary bookings={data.bookings} location={data.location} />
          <PaymentTotal name="Harga" amount={data.subtotal} />
        </div>
        <div className="md:col-span-1 p-4 rounded-xl shadow bg-white space-y-4 text-black border-1 border-gray-200 self-start">
          <PayerInfo register={register} errors={errors} />

          <Controller
            control={control}
            name="paymentType"
            render={({ field }) => (
              <PaymentMethod
                selected={field.value}
                onSelect={field.onChange}
                isMembership={data.paymentType === 'membership'} />
            )}
          />

          <PaymentPolicy control={control} errors={errors} />
          <div className="space-y-2">
            {data.paymentType === 'membership' && data.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span>Rp{data.subtotal.toLocaleString('id-ID')}</span>
              </div>
            )}
            {data.paymentType === 'membership' && data.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon Membership:</span>
                <span>-Rp{data.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <PaymentTotal
                name={"Total Pembayaran"}
                amount={totalPayment}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <PaymentAction disabled={!policyAgreed} />
            <div className="min-h-[1.5rem] flex items-center justify-center">
              {!policyAgreed && (
                <p className="text-sm text-red-500 text-center transition-opacity duration-200 ease-in-out">
                  Anda harus menyetujui kebijakan lapangan terlebih dahulu
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}