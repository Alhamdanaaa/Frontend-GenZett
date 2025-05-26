import { Separator } from '@/components/ui/separator';
import { FaTiktok, FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import Link from "next/link";

export default function FooterUser() {
  return (
    <footer className='bg-[#2C473A] text-neutral-100'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4'>
        {/* Logo & Description */}
        <div className='col-span-1'>
          <h2 className='mb-4 text-2xl font-bold text-white'>
            ReSports
          </h2>
        </div>

        {/* Links */}
        <div className='col-span-1'>
          <h4 className='mb-3 text-lg font-semibold text-[#C5FC40]'>Useful Links</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link href='/' className='hover:underline'>
                Beranda
              </Link>
            </li>
            <li>
              <Link href='/reservation' className='hover:underline'>
                Reservasi
              </Link>
            </li>
            <li>
              <Link href='/history' className='hover:underline'>
                Riwayat
              </Link>
            </li>
            {/* <li>
              <Link href='#' className='hover:underline'>
                Paket Langganan
              </Link>
            </li> */}
          </ul>
        </div>

        <div className='col-span-1'>
          <h4 className='mb-3 text-lg font-semibold text-[#C5FC40]'>Follow Us</h4>
          <ul className='flex space-x-4 text-2xl'>
            <li>
              <Link href='#' passHref legacyBehavior>
                <a aria-label='TikTok'>
                  <FaTiktok className='h-6 w-6' />
                </a>
              </Link>
            </li>
            <li>
              <Link href='#' passHref legacyBehavior>
                <a aria-label='Instagram'>
                  <FaInstagram className='h-6 w-6' />
                </a>
              </Link>
            </li>
            <li>
              <Link href='#' passHref legacyBehavior>
                <a aria-label='WhatsApp'>
                  <FaWhatsapp className='h-6 w-6' />
                </a>
              </Link>
            </li>
            <li>
              <Link href='#' passHref legacyBehavior>
                <a aria-label='Facebook'>
                  <FaFacebook className='h-6 w-6' />
                </a>
              </Link>
            </li>
          </ul>
        </div>

        <div className='col-span-1'>
          <h4 className='mb-3 text-lg font-semibold text-[#C5FC40]'>Contact</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link href='tel:081234567890' className='hover:underline'>
                0812-3456-7890
              </Link>
            </li>
            <li>
              <Link href='mailto:support@resports.agency' className='hover:underline'>
                support@resports.agency
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Separator className='my-4' />

      <div className='mx-auto max-w-7xl px-4 pb-6 text-right text-xs'>
        &copy; 2025 ReSports. All rights reserved.
      </div>
    </footer>
  );
}