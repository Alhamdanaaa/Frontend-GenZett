'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { DailyReservation } from '@/constants/data';

interface BarGraphProps {
  data: DailyReservation[];
  title?: string;
  description?: string;
  className?: string;
}

const chartConfig = {
  total_reservasi: {
    label: 'Total Reservasi',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export default function BarGraph({ 
  data, 
  title = 'Grafik Reservasi Harian',
  description = 'Total reservasi per hari (3 bulan terakhir)',
  className = ''
}: BarGraphProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Transform data untuk recharts
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      date: item.DATE,
      total_reservasi: item.total_reservasi
    }));
  }, [data]);

  // Calculate total reservations
  const totalReservations = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.total_reservasi, 0);
  }, [chartData]);

  if (!isClient) {
    return <div>Loading Bar Graph...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <Card className={`@container/card !pt-3 ${className}`}>
        <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0'>
          <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Tidak ada data reservasi</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <div className='flex h-[250px] w-full items-center justify-center text-muted-foreground'>
            Tidak ada data untuk ditampilkan
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`@container/card !pt-3 ${className}`}>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              {description}
            </span>
            <span className='@[540px]/card:hidden'>3 bulan terakhir</span>
          </CardDescription>
        </div>
        <div className='flex'>
          <div className='relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:px-8 sm:py-6'>
            <span className='text-muted-foreground text-xs'>
              Total Reservasi
            </span>
            <span className='text-lg leading-none font-bold sm:text-3xl'>
              {totalReservations.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('id-ID', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='total_reservasi'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey='total_reservasi'
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}