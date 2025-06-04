const PaymentTotal = ({ name, amount }: { name: string, amount: number }) => (
  <div className="flex justify-between items-center font-semibold text-base">
    <span>Total {name}</span>
    <span>Rp {amount.toLocaleString('id-ID')}</span>
  </div>
)

export default PaymentTotal