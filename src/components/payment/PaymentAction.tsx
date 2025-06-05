type Props = {
  disabled: boolean
}

export default function PaymentAction({ disabled}: Props) {
  return (
    <div className="pt-4">
      <button
        type="submit"
        className={`w-full text-white py-2 rounded-md text-sm font-semibold
          ${disabled ? 'disable bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
        disabled={disabled}
      >
        Bayar Sekarang
      </button>
      
    </div>
  )
}