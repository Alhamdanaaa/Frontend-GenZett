export const PaymentMethod = ({
  selected,
  onSelect,
  isMembership
}: {
  selected: "dp" | "full"
  onSelect: (value: "dp" | "full") => void
  isMembership: boolean
}) => (
  <div className="space-y-2">
    <h3 className="font-medium text-sm">Metode Pembayaran</h3>
    <div className="flex items-center gap-4 justify-between">
      {/* DP Option */}
      <label className={`flex items-center gap-2 text-sm ${isMembership ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
        <input
          type="radio"
          name="payment"
          checked={selected === "dp"}
          onChange={() => !isMembership && onSelect("dp")}
          className="accent-lime-600"
          disabled={isMembership}
        />
        <div className="flex items-baseline gap-1">
          <span>DP</span>
          <span className="text-lime-600 font-medium">50%</span>
          {isMembership && <span className="text-xs text-gray-500 ml-1">(Tidak tersedia)</span>}
        </div>
      </label>

      {/* Full Payment Option */}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="radio"
          name="payment"
          checked={selected === "full"}
          onChange={() => onSelect("full")}
          className="accent-lime-600"
        />
        <div className="flex items-baseline gap-1">
          <span>Full</span>
          <span className="text-lime-600 font-medium">100%</span>
        </div>
      </label>
    </div>
  </div>
)

export default PaymentMethod