import { fetchDashboardData } from '@/lib/api/dashboardsuadmin'
import Dashboard from '@/components/dashboard/Dashboard';
import BarStats from './@bar_stats/page';
import PieStats from './@pie_stats/page';

export default async function OverviewPage() {
    try {
        // Fetch semua data dari satu endpoint
        const dashboardData = await fetchDashboardData();
        console.log('[PAGE] Received data:', dashboardData);

        return (
            <>
                <Dashboard
                    total_lapangan={dashboardData.total_lapangan}
                    total_cabang={dashboardData.total_cabang}
                    total_admin={dashboardData.total_admin}
                    total_cabor={dashboardData.total_cabor}
                />
                
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
                    <div className='col-span-4'>
                        <BarStats />
                    </div>
                    <div className='col-span-4 md:col-span-3'>
                        <PieStats />
                    </div>
                </div>
            </>
        );
    } catch (error) {
        console.error('[PAGE] Error fetching dashboard data:', error);
        
        return (
            <>
                <Dashboard
                    total_lapangan={0}
                    total_cabang={0}
                    total_admin={0}
                    total_cabor={0}
                />
                
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
                    <div className='col-span-4'>
                        <BarStats />
                    </div>
                    <div className='col-span-4 md:col-span-3'>
                        <PieStats />
                    </div>
                </div>
            </>
        );
    }
}