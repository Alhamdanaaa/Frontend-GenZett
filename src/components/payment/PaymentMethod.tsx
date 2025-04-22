export const PaymentMethod = ({
    selected,
    onSelect
  }: {
    selected: "dp" | "full"
    onSelect: (value: "dp" | "full") => void
  }) => (
    <div className="space-y-2">
      <h3 className="font-semibold">Metode Pembayaran</h3>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            checked={selected === "dp"}
            onChange={() => onSelect("dp")}
            className="accent-orange-600"
          />
          <span>Down Payment 50%</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            checked={selected === "full"}
            onChange={() => onSelect("full")}
            className="accent-orange-600"
          />
          <span>Full Payment 100%</span>
        </label>
      </div>
    </div>
  )
  
  export default PaymentMethod