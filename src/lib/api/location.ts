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
//   formData.append('locationPath', data.img[0]); // kirim file

  const res = await api.post('/locations', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}


export async function updateLocation(locationId: number, data: Partial<Location>) {
  const formData = new FormData();
  console.log('data:', data);
  if (data.locationName) formData.append('locationName', data.locationName);
  if (data.description) formData.append('description', data.description);
  if (data.address) formData.append('address', data.address);
  if (data.imageUrl && data.imageUrl.length > 0) {
    formData.append('locationPath', data.imageUrl[0]); // contoh kalo mau upload file baru
  }

  const res = await api.put(`/locations/${locationId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
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