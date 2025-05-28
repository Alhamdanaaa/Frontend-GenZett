// features/schedule/hooks/use-schedule-data.ts
import { useState, useEffect } from 'react';
import { getScheduleData, type Schedule, type Field, type ScheduleApiResponse } from '@/lib/api/schedule';

export function useScheduleData() {
  const [data, setData] = useState<ScheduleApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getScheduleData();
        console.log('result', result);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching schedule data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    schedules: data?.schedules || [],
    fields: data?.fields || [],
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      getScheduleData().then(setData).catch(setError).finally(() => setIsLoading(false));
    }
  };
}
// // features/schedule/hooks/use-schedule-data.ts
// import { useState, useEffect } from 'react';
// import { getScheduleData, type ScheduleApiResponse } from '@/lib/api/schedule';

// export function useScheduleData(filters: {
//   date?: Date;
//   sport?: string;
//   locationId?: number;
// }) {
//   const [data, setData] = useState<ScheduleApiResponse | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const result = await getScheduleData({
//         date: filters.date?.toISOString().split('T')[0],
//         sport: filters.sport !== 'all' ? filters.sport : undefined,
//         locationId: filters.locationId || 1, // default ke 1
//       });
//       setData(result);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//       console.error('Error fetching schedule data:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filters.date, filters.sport, filters.locationId]);

//   return {
//     schedules: data?.schedules || [],
//     fields: data?.fields || [],
//     isLoading,
//     error,
//     refetch: fetchData,
//   };
// }
