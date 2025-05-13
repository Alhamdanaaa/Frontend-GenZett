'use client'

import { useForm, Controller } from 'react-hook-form'
import BookingSummary from './BookingSummary'
import PaymentTotal from './PaymentTotal'
import PayerInfo from './PayerInfo'
import PaymentMethod from './PaymentMethod'
import PaymentPolicy from './PaymentPolicy'
import PaymentAction from './PaymentAction'

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

  const {
    register,
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

  const policyAgreed = watch('policyAgreement')
  const selectedPaymentType = watch('paymentType')
  const totalPayment = selectedPaymentType === 'dp' ? data.subtotal * 0.5 : data.subtotal

  return (
    <form
      // onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between space-y-6 mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-24 md:px-48">
        {/* Ringkasan Pemesanan */}
        <div className="md:col-span-2 p-4 rounded-xl shadow bg-white space-y-2 text-black h-fit overflow-y-auto border-2 border-gray-200 border-opacity-75">
          <h2 className="font-semibold text-lg text-center">Ringkasan Pemesanan</h2>
          <BookingSummary bookings={data.bookings} location={data.location} />
          <PaymentTotal name="Harga" amount={data.subtotal} />
        </div>

        {/* Form Pembayaran */}
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
