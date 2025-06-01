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
  pricePerSlot: number
}

type Props = {
  data: {
    bookings: Booking[]
    location: string
    subtotal: number
    paymentType: 'Reguler' | 'Langganan'
    userId: string
    membershipId?: string | null
  }
}

type DetailItem = {
    fieldId: number;
    timeIds: number[];
    date: string;
};

type Payload = {
  userId: number,
  name: string,
  paymentStatus: string,
  total: number,
  details: DetailItem[]
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
          setUserData({ name: user.name, phone: user.phone })
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
      policyAgreement: true,
    })
  }, [userData, reset])

  const policyAgreed = watch('policyAgreement')
  const selectedPaymentType = watch('paymentType')
  const totalPayment = selectedPaymentType === 'dp' ? data.subtotal * 0.5 : data.subtotal

  const onSubmit = async (formData: FormData) => {
    console.log('Isi data.bookings (diformat):', JSON.stringify(data.bookings, null, 2))

    if (!data.userId) {
      console.error('User ID tidak ditemukan');
      return;
    }

    // Validasi data bookings
    if (!data.bookings || data.bookings.length === 0) {
      alert('Tidak ada data booking yang dipilih');
      return;
    }

    // Konversi userId ke number
    const userIdNumber = parseInt(data.userId);
    if (isNaN(userIdNumber)) {
      console.error('User ID tidak valid');
      return;
    }

    // Siapkan payload sesuai format Payload
    const payload: Partial<Payload> = {
      userId: userIdNumber,
      name: formData.name,
      paymentStatus: "pending",
      total: totalPayment,
      details: data.bookings.map(booking => ({
        fieldId: parseInt(booking.fieldId), // Konversi ke number
        timeIds: booking.timeIds.map(id => parseInt(id)), // Konversi ke array of number
        date: booking.date
      })),
      // Field tambahan yang mungkin diperlukan
      // phone: formData.phone,
      ...(data.membershipId && {
        membershipId: parseInt(data.membershipId) || 0 // Konversi ke number atau default 0
      })
    };

    console.log('Payload yang dikirim:', payload);

    try {
      const res = await createReservation(payload);
      if (res?.invoice_url) {
        router.push(res.invoice_url);
      } else {
        throw new Error('Response tidak mengandung invoice_url');
      }
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
        <div className="md:col-span-2 p-4 rounded-xl shadow bg-white space-y-2 text-black h-fit border-2 border-gray-200">
          <h2 className="font-semibold text-lg text-center">Ringkasan Pemesanan</h2>
          <BookingSummary bookings={data.bookings} location={data.location} />
          <PaymentTotal name="Harga" amount={data.subtotal} />
        </div>

        <div className="md:col-span-1 p-4 rounded-xl shadow bg-white space-y-4 text-black h-fit border-2 border-gray-200">
          <PayerInfo register={register} errors={errors} />

          <Controller
            control={control}
            name="paymentType"
            render={({ field }) => (
              <PaymentMethod selected={field.value} onSelect={field.onChange} />
            )}
          />

          <PaymentPolicy control={control} errors={errors} />
          <PaymentTotal name="Total Pembayaran" amount={totalPayment} />

          <div className="mt-4 space-y-2">
            <PaymentAction disabled={!policyAgreed} />
            {!policyAgreed && (
              <p className="text-sm text-red-500 text-center">
                Anda harus menyetujui kebijakan lapangan terlebih dahulu
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}