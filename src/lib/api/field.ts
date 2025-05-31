import api from "../axios";

type FilterParams = {
  page?: string;
  limit?: string;
  search?: string;
  sport?: string;
};
interface ApiFieldData {
  locationId: number;
  sportId: number;
  name: string;
  startHour: string;
  endHour: string;
  description: string;
  start: string[];
  end: string[];
  price: number[];
}
export async function getFields(params: FilterParams) {
  const res = await api.get("/fields", { params });
  return res.data;
}
export async function getFieldById(fieldId: number) {
  try {
    const res = await api.get(`/fields/${fieldId}`);
    return res.data.field;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createField(data: ApiFieldData) {
  const payload = {
    name: data.name,
    locationId: data.locationId,
    sportId: data.sportId,
    description: data.description,
    startHour: data.startHour,
    endHour: data.endHour,
    start: data.start,
    end: data.end,
    price: data.price,
  };

  const res = await api.post('/fields', payload);
  console.log(payload);
  return res.data;
}

export async function updateField(fieldId: number, data: ApiFieldData) {
  const payload = {
    name: data.name,
    locationId: data.locationId,
    sportId: data.sportId,
    description: data.description,
    startHour: data.startHour,
    endHour: data.endHour,
    start: data.start,
    end: data.end,
    price: data.price,
    _method: 'PUT', // spoofing untuk Laravel
  };

  const res = await api.post(`/fields/${fieldId}`, payload);
  return res.data;
}
export async function deleteField(fieldId: number) {
  const res = await api.delete(`/fields/${fieldId}`);
  return res.data;
}
