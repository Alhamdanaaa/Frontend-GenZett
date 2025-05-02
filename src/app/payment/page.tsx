import NavUser from "@/components/user/navbar-user"
import PaymentDetailsSection from "@/components/payment/PaymentDetailSection"

export default function PaymentPage() {
  return (
    <div>
      <NavUser/>
      <div className="p-4 space-y-4 bg-white px-4">
        <div className="space-y-4">
          <PaymentDetailsSection />
        </div>
      </div>
    </div>
  )
}
