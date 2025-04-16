import { Sport } from '@/constants/data';
import { fakeSports } from '@/constants/mock-api';
import { SportTable } from './sport-tables';
import { columns } from './sport-tables/columns';

type SportListingPage = {};

export default async function SportListingPage({}: SportListingPage) {
  const data = await fakeSports.getSports(); // Ambil semua data sport
  const totalSports = data.length;
  const Sports: Sport[] = data;

  return (
    <SportTable
      data={Sports}
      totalItems={totalSports}
      columns={columns}
    />
  );
}
