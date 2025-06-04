'use client';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { DataTableSchedule } from '@/components/ui/table/data-table-schedule';
import { useScheduleData } from '@/features/schedule/hooks/use-schedule-data';
import { generateColumns, generateTableData } from './columns';
import { filterSchedules, getFieldNamesForSport } from '@/lib/api/schedule';

type ScheduleListingPageProps = {
  selectedDate: Date;
  selectedSport: string;
  locationId?: number; // Optional location filter
};

export default function ScheduleListingPage({ 
    selectedDate, 
    selectedSport,
    locationId = 1
  }: ScheduleListingPageProps) {
    const { schedules, fields, isLoading, error } = useScheduleData(
      {
    date: selectedDate,
    sport: selectedSport,
    locationId,
  }
);
  
  const { columns, tableData, stats } = useMemo(() => {
    if (!schedules.length || !fields.length) {
      return { columns: [], tableData: [], stats: null };
    }
    
    // Format date to match API format (YYYY-MM-DD)
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Filter schedules based on selected criteria
    const filteredSchedules = filterSchedules(
      schedules, 
      formattedDate, 
      selectedSport, 
      locationId
    );

    // Get relevant field names for the selected sport
    const relevantFields = getFieldNamesForSport(
      fields, 
      schedules, 
      selectedSport, 
      locationId
    ).slice(0, 8); // Limit to 8 fields for performance

    // Calculate some statistics
    const totalBookings = filteredSchedules.length;
    const completeBookings = filteredSchedules.filter(s => s.paymentStatus === 'complete').length;
    const pendingBookings = filteredSchedules.filter(s => s.paymentStatus === 'pending').length;

    return {
      columns: generateColumns(relevantFields),
      tableData: generateTableData(filteredSchedules, fields, relevantFields, formattedDate),
      stats: {
        total: totalBookings,
        complete: completeBookings,
        pending: pendingBookings,
        fields: relevantFields.length
      }
    };
  }, [selectedDate, selectedSport, locationId, schedules, fields]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Memuat Jadwal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="mb-2">Error loading schedule data:</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Statistics Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">Total Booking</p>
            <p className="text-xl font-bold text-blue-800">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600">Terbayar</p>
            <p className="text-xl font-bold text-green-800">{stats.complete}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-600">Pending</p>
            <p className="text-xl font-bold text-yellow-800">{stats.pending}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Lapangan</p>
            <p className="text-xl font-bold text-gray-800">{stats.fields}</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Terbayar Lunas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Pending Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>DP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          <span>Tersedia</span>
        </div>
      </div>

      {/* Schedule Table */}
      <DataTableSchedule table={table} />
      
      {/* Empty State */}
      {tableData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Tidak ada data jadwal untuk tanggal dan olahraga yang dipilih.</p>
        </div>
      )}
    </div>
  );
}