import HistoryPage from './views/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Riwayat',
};

export default function HistoriesPage() {
  return <HistoryPage />;
}