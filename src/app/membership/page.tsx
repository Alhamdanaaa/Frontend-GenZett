import NavbarUser from "@/components/user/navbar-user";
import MemberCard from "@/components/member/MemberCard";

export default function MembershipPage() {

  return (
    <><div>
      <NavbarUser />
    </div>
      <div className="bg-gray-50 py-10 text-black px-24 md:px-48 overflow-hidden">
        <h1 className="text-2xl font-bold text-center mb-2">Pilih Paket Membership Sesuai Kebutuhanmu</h1>
        <p className="text-center text-gray-500 mb-10">Dapatkan akses eksklusif dan berbagai keuntungan dengan paket membership kami!</p>
        <MemberCard/>
      </div></>
  );
}
