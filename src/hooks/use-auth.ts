// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode';
// import type { JwtPayload as DefaultJwtPayload } from '@/types/jwt';

// type JwtPayload = DefaultJwtPayload & {
//   exp: number;
//   iat: number;
// };

// export function useAuth() {
//   const [user, setUser] = useState<JwtPayload | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('token='))
//       ?.split('=')[1];

//     if (token) {
//       try {
//         const decoded = jwtDecode<JwtPayload>(token);

//         const now = Math.floor(Date.now() / 1000);
//         if (decoded.exp < now) {
//           console.warn('Token expired');
//           logout();
//           return;
//         }

//         setUser(decoded);
//       } catch (error) {
//         console.error('Token decode error:', error);
//         logout();
//       }
//     } else {
//       // Optional: redirect to login if no token
//       // router.push('/login');
//     }
//   }, []);

//   const logout = () => {
//     document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//     setUser(null);
//     router.push('/login');
//   };

//   return { user, logout };
// }
