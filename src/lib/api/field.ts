import api from "../axios";

type FilterParams = {
  page?: string;
  limit?: string;
  search?: string;
  sport?: string;
};
interface FieldPayload {
  name: string;
  location: string;
  sport: string;
  description: string;
  startHour: string; 
  endHour: string; 
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

export async function createField(data: FieldPayload) {
  const payload = {
    name: data.name,
    locationId: parseInt(data.location, 10),
    sportId: parseInt(data.sport, 10),
    description: data.description,
    startHour: data.startHour,
    endHour: data.endHour,
  };

  const res = await api.post('/fields', payload);
  console.log(payload);
  return res.data;
}

export async function updateField(fieldId: number, data: FieldPayload) {
  const payload = {
    name: data.name,
    locationId: parseInt(data.location, 10),
    sportId: parseInt(data.sport, 10),
    description: data.description,
    startHour: data.startHour,
    endHour: data.endHour,
    _method: 'PUT', // spoofing untuk Laravel
  };

  const res = await api.post(`/fields/${fieldId}`, payload);
  return res.data;
}
export async function deleteField(fieldId: number) {
  const res = await api.delete(`/fields/${fieldId}`);
  return res.data;
}