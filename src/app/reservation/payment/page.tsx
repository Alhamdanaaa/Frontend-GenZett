import PaymentPage from './views/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pembayaran | ReSports',
};

export default function page() {
  return <PaymentPage />;
}