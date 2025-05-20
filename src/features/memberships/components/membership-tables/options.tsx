import { useEffect, useState } from 'react';
import { getLocations } from '@/lib/api/location';
import { getSports } from '@/lib/api/sports';

type Option = {
  value: string;
  label: string;
};

export function useLocationsOptions(): Option[] {
  const [locations, setLocations] = useState<Option[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations({ limit: '100' });
        if (res.success) {
          const options = res.locations.map((loc: any) => ({
            value: loc.locationId,
            label: loc.locationName
          }));
          setLocations(options);
        }
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      }
    };

    fetchLocations();
  }, []);

  return locations;
}

export function useSportsOptions(): Option[] {
  const [sports, setSports] = useState<Option[]>([]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await getSports({ limit: '100' });
        if (res.success) {
          const options = res.sports.map((sport: any) => ({
            value: sport.sportId,
            label: sport.sportName
          }));
          setSports(options);
        }
      } catch (err) {
        console.error('Failed to fetch sports:', err);
      }
    };

    fetchSports();
  }, []);

  return sports;
}
