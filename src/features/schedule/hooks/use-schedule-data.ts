import { useEffect, useState } from 'react';
import { Schedule } from '@/constants/data';
import { fakeSchedules } from '@/constants/mock-api';

export function useScheduleData() {
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Inisialisasi data jika belum
        if (fakeSchedules.records.length === 0) {
          fakeSchedules.initialize();
        }
        
        // Gunakan fungsi existing dari mock-api
        const response = await fakeSchedules.getSchedules({
          limit: 50 // Batasi jumlah data
        });
        
        setScheduleData(response.schedules);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { scheduleData, isLoading, error };
}
// 'use client';
// import { useEffect, useState } from 'react';
// import { Schedule } from '@/constants/data';
// import { getScheduleData } from '@/services/schedule-service';

// export function useScheduleData() {
//   const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setIsLoading(true);
//         // Get data from the optimized service
//         const data = await getScheduleData();
//         setScheduleData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err : new Error('Unknown error'));
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   return { scheduleData, isLoading, error };
// }