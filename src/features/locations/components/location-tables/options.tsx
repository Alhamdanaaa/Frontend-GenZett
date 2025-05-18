export const SPORTS_OPTIONS = [
  { value: 'Futsal', label: 'Futsal' },
  { value: 'Badminton', label: 'Badminton' },
  { value: 'Basketball', label: 'Basketball' },
  { value: 'Volleyball', label: 'Volleyball' },
  { value: 'Tennis', label: 'Tennis' },
  { value: 'Sepak Bola', label: 'Sepak Bola' },
  { value: 'Handball', label: 'Handball' }
];

// import { useEffect, useState } from "react";
// import { getAllSports } from "@/lib/api/location";

// export function useSportsOptions() {
//   const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

//   useEffect(() => {
//     async function fetchSports() {
//       try {
//         const sports = await getAllSports();
//         const formatted = sports.map((sport: { sportId: string; sportName: string }) => ({
//           label: sport.sportName,
//           value: sport.sportId,
//         }));
//         setOptions(formatted);
//       } catch (error) {
//         console.error("Failed to fetch sports:", error);
//       }
//     }

//     fetchSports();
//   }, []);

//   return options;
// }
