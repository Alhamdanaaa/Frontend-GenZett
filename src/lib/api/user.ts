import api from "../axios";
import { User } from '@/constants/data';

export async function getUserById(userId: number): Promise<User | null> {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}