import { fetchDashboardData } from '@/lib/api/dashboardsuadmin';
import BarGraph from '@/features/overview/components/bar-graph';

export default async function BarStats() {
  try {
    // Fetch dashboard data
    const dashboardData = await fetchDashboardData();
    
    return (
      <BarGraph 
        data={dashboardData.daily_reservations}
        title="Grafik Reservasi Harian Seluruh Cabang"
        description="Total reservasi per hari (3 bulan terakhir)"
      />
    );
  } catch (error) {
    console.error('Error fetching bar stats data:', error);
    
    // Return error state
    return (
      <BarGraph 
        data={[]}
        title="Grafik Reservasi Harian"
        description="Gagal memuat data reservasi"
      />
    );
  }
}