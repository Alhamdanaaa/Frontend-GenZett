import PaymentPage from './views/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservasi | Pembayaran',
};

export default function page() {
  return <PaymentPage />;
}