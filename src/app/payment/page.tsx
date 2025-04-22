// import NavUser from "@/components/user/navbar-user"
import PaymentDetailsSection from "@/components/payment/PaymentDetailSection"

export default function PaymentPage() {
  return (
    <div>
      {/* <NavUser/> */}
      <div className="font-poppins p-4 space-y-4 bg-white">
        <div className="space-y-4 mb-96">
          <PaymentDetailsSection />
        </div>
      </div>
    </div>
  )
}
