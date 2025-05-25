import api from "../axios";

type FilterParams = {
  date?: string;
  locationId?: string;
  sport?: string;
};

export interface ScheduleItem {
  locationId: number;
  name: string;
  date: string;
  fieldTime: string;
  fieldName: string;
  sport: string;
  paymentStatus: 'pending' | 'complete' | 'dp';
}

export interface FieldItem {
  fieldId: number;
  fieldName: string;
  sportName: string;
  locationId: number;
}

export async function getSchedules(params: FilterParams) {
  const res = await api.get("/schedules", { params });
  return res.data;
}

// API untuk mendapatkan lapangan berdasarkan cabang olahraga
export async function getFieldsBySport(sport: string, locationId?: string) {
  const params: Record<string, string> = { sport };
  if (locationId) {
    params.locationId = locationId;
  }
  const res = await api.get("/fields", { params });
  return res.data;
}

// Fungsi untuk mendapatkan semua waktu operasional dari semua lapangan
export function getAllOperatingHours(schedules: ScheduleItem[]): string[] {
  // Set digunakan untuk menghilangkan duplikat
  const uniqueTimesSet = new Set<string>();
  
  // Tambahkan waktu dari jadwal yang ada
  schedules.forEach(schedule => {
    if (schedule.fieldTime) {
      uniqueTimesSet.add(schedule.fieldTime);
    }
  });
  
  // Default operating hours jika tidak ada data
  if (uniqueTimesSet.size === 0) {
    return ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  }
  
  // Konversi set ke array dan urutkan berdasarkan waktu
  return Array.from(uniqueTimesSet).sort((a, b) => {
    const [aHour, aMinute] = a.split(':').map(Number);
    const [bHour, bMinute] = b.split(':').map(Number);
    
    if (aHour !== bHour) {
      return aHour - bHour;
    }
    return aMinute - bMinute;
  });
}

// Fungsi untuk mendapatkan semua nama lapangan dari data jadwal
export function getAllFieldNames(schedules: ScheduleItem[]): string[] {
  // Set digunakan untuk menghilangkan duplikat
  const uniqueFieldsSet = new Set<string>();
  
  schedules.forEach(schedule => {
    if (schedule.fieldName) {
      uniqueFieldsSet.add(schedule.fieldName);
    }
  });
  
  // Konversi set ke array dan urutkan berdasarkan nomor lapangan (jika ada)
  return Array.from(uniqueFieldsSet).sort((a, b) => {
    const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
    const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
    return aNum - bNum;
  });
}

// Fungsi untuk mendapatkan nama lapangan dari API fields
export function getFieldNamesFromFields(fields: FieldItem[]): string[] {
  return fields
    .map(field => field.fieldName)
    .sort((a, b) => {
      const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });
}