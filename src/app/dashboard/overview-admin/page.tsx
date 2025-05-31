import { getUserFromServer } from '@/hooks/use-user';
import { getDashboardAdmin } from '@/lib/api/dashboardadmin';
import DashboardStats from '@/components/dashboard/DashboardAdmin';
import BarStatsClient from './BarStatsClient';

export default async function OverviewPage() {
  const user = await getUserFromServer();
  const locationId = user?.locationId?.toString();

  if (!locationId) {
    console.error('[PAGE] Missing location ID');
    return <p>Unauthorized access</p>;
  }

  try {
    const dashboardData = await getDashboardAdmin(locationId);

    return (
      <>
        <DashboardStats
          totalFields={dashboardData.total_lapangan}
          totalMemberships={dashboardData.total_paket_langganan}
          totalMembershipOrders={dashboardData.total_pesanan_langganan_bulan_ini}
        />
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          <div className="col-span-1">
            <BarStatsClient data={dashboardData} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('[PAGE] Error fetching dashboard data:', error);

    return (
      <>
        <DashboardStats totalFields={0} totalMemberships={0} totalMembershipOrders={0} />
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          <div className="col-span-1">
            <BarStatsClient data={{ reservasi_per_hari: [] }} />
          </div>
        </div>
      </>
    );
  }
}