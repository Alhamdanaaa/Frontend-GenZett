import api from "../axios";

// lib/api/schedule.ts
export type Schedule = {
  locationId: number;
  name: string;
  date: string;
  fieldTime: string;
  fieldName: string;
  sport: string;
  paymentStatus: 'pending' | 'complete' | 'dp';
};

export type Field = {
  fieldId: number;
  name: string;
  times: string[];
};

export type ScheduleApiResponse = {
  schedules: Schedule[];
  fields: Field[];
};

export async function getScheduleData(params?: {
  date?: string;
  sport?: string;
  locationId?: number;
}): Promise<ScheduleApiResponse> {
  // console.log('Before filtering:', params?.date);
console.log('Filtering in lib/api/schedule.ts:', [params]);
// console.log('Filtering for sport:', p);
// console.log('Filtering for locationId:', locationId);

  try {
    const response = await api.get<ScheduleApiResponse>("/schedules", {
      params: params, // otomatis dikonversi jadi query string oleh axios
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    return {
      schedules: [],
      fields: [],
    };
  }
}


// Get unique field names for a specific sport and location
export function getFieldNamesForSport(
  fields: Field[], 
  schedules: Schedule[], 
  sport: string, 
  locationId?: number
): string[] {
  // Get field names from schedules that match the sport filter
  const fieldNamesFromSchedules = schedules
    .filter(s => sport === 'all' || s.sport === sport)
    .filter(s => !locationId || s.locationId === locationId)
    .map(s => s.fieldName);

  // Get all unique field names and sort them
  const allFieldNames = Array.from(new Set([
    ...fieldNamesFromSchedules,
    ...fields.map(f => f.name)
  ]));

  return allFieldNames.sort((a, b) => {
    // Sort by extracting numbers from field names
    const aNum = parseInt(a.match(/\d+/)?.[0] ?? '0');
    const bNum = parseInt(b.match(/\d+/)?.[0] ?? '0');
    return aNum - bNum;
  });
}

// Filter schedules by date, sport, and location
export function filterSchedules(
  schedules: Schedule[],
  selectedDate: string,
  selectedSport: string,
  locationId?: number
): Schedule[] {
  return schedules.filter(schedule => {
    const matchDate = schedule.date === selectedDate;
    const matchSport = selectedSport === 'all' || schedule.sport === selectedSport;
    const matchLocation = !locationId || schedule.locationId === locationId;
    
    return matchDate && matchSport && matchLocation;
  });
}