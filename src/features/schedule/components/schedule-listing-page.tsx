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
  locationId?: number;
};

export default function ScheduleListingPage({ 
    selectedDate, 
    selectedSport,
    locationId = 1
  }: ScheduleListingPageProps) {
    const { schedules, fields, isLoading, error } = useScheduleData({
      date: selectedDate,
      sport: selectedSport,
      locationId,
    });
  
  const { columns, tableData, stats } = useMemo(() => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Always show fields even if no schedules exist
    if (!fields.length) {
      return { columns: [], tableData: [], stats: null };
    }
    
    // IMPORTANT: Filter schedules properly
    // The issue was here - we need to filter schedules correctly
    // console.log('All schedules:', schedules);
    // console.log('Selected sport:', selectedSport);
    // console.log('Formatted date:', formattedDate);
    
    const filteredSchedules = schedules.filter(schedule => {
      const matchesDate = schedule.date === formattedDate;
      const matchesSport = selectedSport === 'all' || String(schedule.sport) === String(selectedSport);
      const matchesLocation = schedule.locationId === locationId;      
      return matchesDate && matchesSport && matchesLocation;
    });

    console.log('Filtered schedules:', filteredSchedules);

    // Get ALL field names for the selected sport/location (from fields data)
    // This ensures we show all available fields even without bookings
    const allFieldsForSport = fields
      .filter(field => field.times && field.times.length > 0) // Only fields with available times
      .map(field => field.name)
      .slice(0, 8); // Limit to 8 fields for performance

    console.log('Fields for sport:', allFieldsForSport);

    // If no fields found, return empty state
    if (allFieldsForSport.length === 0) {
      return { columns: [], tableData: [], stats: null };
    }

    const totalBookings = filteredSchedules.length;
    const completeBookings = filteredSchedules.filter(s => s.paymentStatus === 'complete').length;
    const pendingBookings = filteredSchedules.filter(s => s.paymentStatus === 'pending').length;
    const dpBookings = filteredSchedules.filter(s => s.paymentStatus === 'dp').length;
    
    const totalSlots = allFieldsForSport.reduce((total, fieldName) => {
      const field = fields.find(f => f.name === fieldName);
      return total + (field?.times?.length || 0);
    }, 0);
    
    const availableSlots = totalSlots - totalBookings;

    return {
      columns: generateColumns(allFieldsForSport),
      tableData: generateTableData(filteredSchedules, fields, allFieldsForSport, formattedDate),
      stats: {
        total: totalBookings,
        complete: completeBookings,
        pending: pendingBookings,
        dp: dpBookings,
        fields: allFieldsForSport.length,
        totalSlots,
        availableSlots
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
          <p className="mb-2">Error memuat data jadwal:</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show message when no fields are available for the selected sport
  if (!fields.length || tableData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-gray-500">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak Ada Lapangan Tersedia
            </h3>
            <p className="text-gray-500">
              Tidak ada lapangan yang tersedia untuk olahraga dan tanggal yang dipilih.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Statistics Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
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
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">DP</p>
            <p className="text-xl font-bold text-blue-800">{stats.dp}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Lapangan</p>
            <p className="text-xl font-bold text-gray-800">{stats.fields}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600">Tersedia</p>
            <p className="text-xl font-bold text-green-800">{stats.availableSlots}</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs mb-4 p-4 bg-gray-50 rounded-lg">
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
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
          <span>Tidak Tersedia</span>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="border rounded-lg overflow-hidden">
        <DataTableSchedule table={table} />
      </div>
      
      {/* Additional Information */}
      <div className="text-xs text-gray-500 text-center">
        <p>
          Menampilkan jadwal untuk {format(selectedDate, 'dd MMMM yyyy')} • 
          {stats?.fields} lapangan • {stats?.totalSlots} total slot waktu
        </p>
      </div>
    </div>
  );
}