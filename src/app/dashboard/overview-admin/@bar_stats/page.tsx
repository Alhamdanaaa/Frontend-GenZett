import BarGraphAdmin from '@/features/overview/components/bar-graph-admin';
import { getDashboardAdmin } from '@/lib/api/dashboardadmin';

interface BarStatsProps {
    locationId: string;
}

export default async function BarStats({ locationId }: BarStatsProps) {
    const data = await getDashboardAdmin(locationId);
    return <BarGraphAdmin data={data.reservasi_per_hari} />;
}
