import SportsLocationPage from './views/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservasi',
};

export default function ReservationPage() {
  return <SportsLocationPage />;
}