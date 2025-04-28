'use client';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTableSchedule } from '@/components/ui/table/data-table-schedule';
import { useScheduleData } from '@/features/schedule/hooks/use-schedule-data';
import { generateColumns, generateTableData } from './columns';
import { isSameDay } from 'date-fns';

type ScheduleListingPageProps = {
  selectedDate: Date;
  selectedSport: string;
};

export default function ScheduleListingPage({ 
  selectedDate, 
  selectedSport 
}: ScheduleListingPageProps) {
  // Use a custom hook for data fetching
  const { scheduleData, isLoading } = useScheduleData();
  
  const { columns, tableData } = useMemo(() => {
    if (!scheduleData) {
      return { columns: [], tableData: [] };
    }
    
    const filteredData = scheduleData.filter((item) => {
      const matchDate = isSameDay(new Date(item.date), selectedDate);
      const matchSport =
        selectedSport === 'all' || item.sport === selectedSport;
      return matchDate && matchSport;
    });

    // Limit fields to improve performance
    const allFields = Array.from(
      new Set(scheduleData.map((item) => item.field))
    ).sort(
      (a, b) =>
        parseInt(a.match(/\d+/)?.[0] ?? '0') -
        parseInt(b.match(/\d+/)?.[0] ?? '0')
    );

    return {
      columns: generateColumns(allFields.slice(0, 8)), // Limit to 8 fields at a time
      tableData: generateTableData(filteredData, allFields.slice(0, 8))
    };
  }, [selectedDate, selectedSport, scheduleData]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  if (isLoading) {
    return <div className="h-[400px] w-full flex items-center justify-center">Loading schedule data...</div>;
  }

  return (
    <div className='space-y-4'>
      <DataTableSchedule table={table} />
    </div>
  );
}