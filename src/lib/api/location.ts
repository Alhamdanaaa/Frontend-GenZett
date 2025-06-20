import api from "../axios";
import { Location } from '@/constants/data';

type FilterParams = {
  page?: string;
  limit?: string;
  search?: string;
  sport?: string;
};
export async function getLocations(params: FilterParams) {
  const res = await api.get("/locations", { params });
  return res.data;
}
export async function getLocationById(locationId: number): Promise<Location | null> {
  // try {
    const res = await api.get(`/locations/${locationId}`);
    return res.data.location;
  // } catch (error) {
  //   console.error(error);
  //   return null;
  // }
}
export async function createLocation(data: {
  img?: File[];
  locationName: string;
  address: string;
  description: string;
  }) {
  const formData = new FormData();
  console.log('data:', data);
  formData.append('locationName', data.locationName);
  formData.append('description', data.description);
  formData.append('address', data.address);
  // Pastikan file ada sebelum mengirim
  if (data.img && data.img.length > 0) {
    formData.append('locationPath', data.img[0]); // kirim file dengan nama yang sesuai
  }

  const res = await api.post('/locations', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}


export async function updateLocation(locationId: number, data: Partial<Location> & { img?: File[] }) {
  const formData = new FormData();

  if (data.locationName) formData.append('locationName', data.locationName);
  if (data.description) formData.append('description', data.description);
  if (data.address) formData.append('address', data.address);
  if (data.img && data.img.length > 0) {
    formData.append('locationPath', data.img[0]); // sesuai dengan nama di Laravel
  }

  formData.append('_method', 'PUT'); // spoofing method
  const res = await api.post(`/locations/${locationId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

export async function deleteLocation(locationId: number) {
  const res = await api.delete(`/locations/${locationId}`);
  return res.data;
}
export async function getAllSports() {
  const res = await api.get(`/locations/sports`);
  return res.data;
}
export async function getAllLocations() {
  const res = await api.get(`/locations/allLocations`);
  return res.data;
}

