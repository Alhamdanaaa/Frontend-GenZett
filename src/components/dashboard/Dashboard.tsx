import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconBallFootball, IconMap2, IconSoccerField, IconUserShield } from '@tabler/icons-react';

export default function Dashboard({
  total_lapangan,
  total_cabang,
  total_admin,
  total_cabor,
}: {
  total_lapangan: number;
  total_cabang: number;
  total_admin: number;
  total_cabor: number;
}) {
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Lapangan</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {total_lapangan}
          </CardTitle>
          <CardAction>
            <IconSoccerField />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Lapangan
          </div>
          <div className='text-muted-foreground'>
            Jumlah lapangan untuk keseluruhan lokasi cabang
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Lokasi Cabang</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {total_cabang}
          </CardTitle>
          <CardAction>
            <IconMap2 />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Cabang
          </div>
          <div className='text-muted-foreground'>
            Jumlah lokasi cabang yang tersedia
          </div>
        </CardFooter>
      </Card>
      
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Admin</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {total_admin}
          </CardTitle>
          <CardAction>
            <IconUserShield />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Admin
          </div>
          <div className='text-muted-foreground'>
            Jumlah admin yang aktif sesuai dengan lokasi cabang
          </div>
        </CardFooter>
      </Card>
      
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Cabang Olahraga</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {total_cabor}
          </CardTitle>
          <CardAction>
            <IconBallFootball />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Cabang Olahraga
          </div>
          <div className='text-muted-foreground'>
            Jumlah cabang olahraga yang tersedia
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}