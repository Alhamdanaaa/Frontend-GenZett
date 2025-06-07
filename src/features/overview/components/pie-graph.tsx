'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

import { ReservasiPerCabang } from '@/constants/data';
import { fetchDashboardData } from '@/lib/api/dashboardsuadmin';

const chartConfig: ChartConfig = {};

export default function PieGraph() {
  const [data, setData] = React.useState<ReservasiPerCabang[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const dashboard = await fetchDashboardData();
        setData(dashboard.reservasi_per_cabang);
      } catch (error) {
        console.error('Failed to load statistics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalReservasi = React.useMemo(() => {
    return data?.reduce((acc, curr) => acc + curr.total_reservasi, 0) || 0;
  }, [data]);

  if (isLoading) {
    return <div>Memuat Pie Graph...</div>;
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Total Reservasi Seluruh Cabang</CardTitle>
        <CardDescription>
          {/* <span className='hidden @[540px]/card:block'>
            Total Reservasi Tiap Cabang pada 6 Bulan Terakhir
          </span> */}
          <span className='@[540px]/card:hidden'>Data reservasi per Lokasi Cabang</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {data.map((item, index) => (
                <linearGradient
                  key={item.locationName}
                  id={`fill${item.locationName}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='0%'
                    stopColor='var(--primary)'
                    stopOpacity={1 - index * 0.15}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--primary)'
                    stopOpacity={0.8 - index * 0.15}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data.map((item) => ({
                ...item,
                fill: `url(#fill${item.locationName})`
              }))}
              dataKey='total_reservasi'
              nameKey='locationName'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalReservasi.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Reservasi
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {data.length > 0 && (
          <div className="flex items-center gap-2 leading-none font-medium">
            <span className="text-primary font-semibold">Lokasi Cabang {data[0].locationName}</span>
            <IconTrendingUp className="h-4 w-4 text-primary" />
          </div>
        )}
        <div className='text-muted-foreground leading-none'>
          Memiliki reservasi terbanyak dengan {data[0].total_reservasi.toLocaleString()} pesanan
            ({((data[0].total_reservasi / totalReservasi) * 100).toFixed(1)}%)
        </div>
      </CardFooter>
    </Card>
  );
}