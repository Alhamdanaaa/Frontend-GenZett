'use client';
import { generateColumns, generateTableData } from './columns';
import { useMemo, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { isSameDay } from 'date-fns';
import ScheduleFilter from './schedule-filter';
import { fakeSchedules } from '@/constants/mock-api';
import { DataTableSchedule } from '@/components/ui/table/data-table-schedule';

export default function ScheduleListingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date('2024-05-27'));
  const [selectedSport, setSelectedSport] = useState('Futsal');

  const { columns, tableData } = useMemo(() => {
    const allData = fakeSchedules.records;

    const filteredData = allData.filter((item) => {
      const matchDate = isSameDay(new Date(item.date), selectedDate);
      const matchSport =
        selectedSport === 'all' || item.sport === selectedSport;
      return matchDate && matchSport;
    });

    const allFields = Array.from(
      new Set(allData.map((item) => item.field))
    ).sort(
      (a, b) =>
        parseInt(a.match(/\d+/)?.[0] ?? '0') -
        parseInt(b.match(/\d+/)?.[0] ?? '0')
    );

    return {
      columns: generateColumns(allFields),
      tableData: generateTableData(filteredData, allFields)
    };
  }, [selectedDate, selectedSport]);
  console.log('columns', columns);
  console.log('tableData', tableData);

  const memoColumns = useMemo(() => columns, [columns]);
  const memoData = useMemo(() => tableData, [tableData]);

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className='space-y-4'>
      <ScheduleFilter
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
      />
      <DataTableSchedule table={table} />
    </div>
  );
}
