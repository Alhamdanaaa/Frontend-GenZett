import NavbarUser from '@/components/user/navbar-user'
import FooterUser from '@/components/user/footer-user';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarUser />
      <main className="pt-4 px-6">{children}</main>
      <FooterUser />
    </>
  )
}
