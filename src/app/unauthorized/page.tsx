'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className='absolute top-1/2 left-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'>
      <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent'>
        403
      </span>
      <h2 className='font-heading my-2 text-2xl font-bold'>
        Akses Ditolak
      </h2>
      <p>
        Kamu tidak memiliki akses ke halaman ini.
      </p>
      <div className='mt-8 flex justify-center gap-2'>
        <Button onClick={() => router.back()} variant='default' size='lg'>
          Kembali
        </Button>
        <Button
          onClick={() => router.push('/dashboard')}
          variant='ghost'
          size='lg'
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
