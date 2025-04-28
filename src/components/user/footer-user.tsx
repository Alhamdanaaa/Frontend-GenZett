import { Separator } from '@/components/ui/separator';
import { FaTiktok, FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa';

export default function FooterUser() {
  return (
    <footer className='mt-10 bg-[#2C473A] text-neutral-100'>
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
              <a href='#' className='hover:underline'>
                Home
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                About Us
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Booking
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div className='col-span-1'>
          <h4 className='mb-3 text-lg font-semibold text-[#C5FC40]'>Follow Us</h4>
          <ul className='flex space-x-4 text-2xl'>
            <li>
              <a 
                href='#' 
                // className='hover:text-pink-600' 
                aria-label='TikTok'>
                <FaTiktok className='h-6 w-6' />
              </a>
            </li>
            <li>
              <a
                href='#'
                // className='hover:text-purple-600'
                aria-label='Instagram'
              >
                <FaInstagram className='h-6 w-6' />
              </a>
            </li>
            <li>
              <a
                href='#'
                // className='hover:text-green-500'
                aria-label='WhatsApp'
              >
                <FaWhatsapp className='h-6 w-6' />
              </a>
            </li>
            <li>
              <a 
                href='#' 
                // className='hover:text-blue-600' 
                aria-label='Facebook'>
                <FaFacebook className='h-6 w-6' />
              </a>
            </li>
          </ul>
        </div>

        <div className='col-span-1'>
          <h4 className='mb-3 text-lg font-semibold text-[#C5FC40]'>Contact</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <a href='#' className='hover:underline'>
                0812-3456-7890
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                support@resports.agency
              </a>
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
