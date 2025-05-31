
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconPackage, IconReceipt, IconSoccerField, } from '@tabler/icons-react';

export default function DashboardAdmin({
  totalFields,
  totalMemberships,
  totalMembershipOrders,
}: {
  totalFields: number;
  totalMemberships: number;
  totalMembershipOrders: number;
}) {
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Lapangan</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {totalFields}
          </CardTitle>
          <CardAction>
            {/* <Badge variant='outline'> */}
            <IconSoccerField />
            {/* +12.5% */}
            {/* </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Lapangan
          </div>
          <div className='text-muted-foreground'>
            Jumlah lapangan
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Jenis Paket Langganan</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {totalMemberships}
          </CardTitle>
          <CardAction>
            {/* <Badge variant='outline'> */}
            <IconPackage />
            {/* -20% */}
            {/* </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Paket Langganan
          </div>
          <div className='text-muted-foreground'>
            Jumlah jenis paket member dari cabang
          </div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Pesanan Paket Langganan</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {totalMembershipOrders}
          </CardTitle>
          <CardAction>
            {/* <Badge variant='outline'> */}
            <IconReceipt />
            {/* +12.5% */}
            {/* </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Reservasi Paket Langganan
          </div>
          <div className='text-muted-foreground'>
            Jumlah reservasi paket langganan bulan ini
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
