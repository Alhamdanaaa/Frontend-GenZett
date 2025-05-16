import HomePage from './user/views/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beranda',
  description: 'Halaman utama bagi pengguna sport center',
}

export default function Home() {
  return <HomePage />;
}