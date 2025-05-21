import api from "../axios";

type FilterParams = {
  page?: string;
  limit?: string;
  search?: string;
  sport?: string;
};
export async function getFields(params: FilterParams) {
  const res = await api.get("/fields", { params });
  return res.data;
}
