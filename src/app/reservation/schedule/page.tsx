import SchedulesPage from './views/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reservasi | Jadwal',
};

export default function ReservationPage() {
  return <SchedulesPage />;
}