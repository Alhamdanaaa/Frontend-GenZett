import { Schedule } from '@/constants/data';
import { fakeSchedules } from '@/constants/mock-api';

// Cache mechanism to avoid reinitializing the data on every call
let cachedSchedules: Schedule[] | null = null;

export async function getScheduleData(): Promise<Schedule[]> {
  // Use cached data if available
  if (cachedSchedules) {
    return cachedSchedules;
  }

  // Initialize data if needed (only once)
  if (fakeSchedules.records.length === 0) {
    fakeSchedules.initialize();
  }

  // Only initialize the first 50 records to reduce processing
  cachedSchedules = fakeSchedules.records.slice(0, 50);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return cachedSchedules;
}