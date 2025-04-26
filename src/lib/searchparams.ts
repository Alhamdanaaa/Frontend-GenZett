import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  sport: parseAsString,
  location: parseAsString,
  paymentStatus: parseAsString,
  status: parseAsString,
  day: parseAsString,
  search: parseAsString,
  date: parseAsString
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
