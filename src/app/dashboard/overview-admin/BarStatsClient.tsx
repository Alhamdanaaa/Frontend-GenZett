"use client";

import BarGraphAdmin from '@/features/overview/components/bar-graph-admin';

interface BarStatsProps {
    data: any; // sesuaikan tipe data
}

export default function BarStatsClient({ data }: BarStatsProps) {
    return <BarGraphAdmin data={data.reservasi_per_hari} />;
}
