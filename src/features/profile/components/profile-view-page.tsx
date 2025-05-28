'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  IconMail,
  IconUser,
  IconCalendarEvent,
  IconShield,
  IconPhone,
  IconMapPin
} from '@tabler/icons-react';
import { getLocationById } from '@/lib/api/location';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type User = {
  name: string;
  email: string;
  phone?: string;
  locationId?: string;
  role: string;
  created_at?: string;
};

export default function ProfileViewPage({ user }: { user: User | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('-');
  const [currentUser, setCurrentUser] = useState<User | null>(user)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])


  useEffect(() => {
    const fetchLocation = async () => {
      if (currentUser?.locationId) {
        const res = await getLocationById(Number(currentUser.locationId));
        setLocationName(res?.locationName || 'Tidak Diketahui');
      }
    };
    fetchLocation();
  }, [currentUser?.locationId]);

  const handleLogout = async () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin logout?');
    if (!confirmed) return;
    setLoading(true);

    try {
      const token =
        localStorage.getItem('token') ||
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Logout error:', error.message);
        if ((error as any).isAxiosError) {
          const axiosError = error as any;
          console.error('HTTP Status:', axiosError.response?.status);
          console.error('Response Data:', axiosError.response?.data);
        }
      } else {
        console.error('Unknown error during logout:', error);
      }
    } finally {
      localStorage.removeItem('token');
      document.cookie = 'token=; Max-Age=0; path=/;';
      document.cookie = 'role=; Max-Age=0; path=/;';
      router.push('/login');
    }
  };

  if (!currentUser) return <div className="w-full p-6">Memuat...</div>;

  return (
    <div className="w-full px-6 py-10">
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <IconUser className="h-16 w-16" />
            <div>
              <CardTitle className="text-xl sm:text-2xl font-semibold">
                {currentUser.name || 'Tanpa Nama'}
              </CardTitle>
              <p className="text-muted-foreground text-sm">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => router.push('/dashboard/profile/edit-profile')}>Edit Profil</Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/profile/edit-password')}>Ubah Password</Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? 'Keluar...' : 'Keluar'}
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informasi Akun</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={<IconUser className="h-5 w-5 text-blue-600" />} label="Nama Lengkap" value={currentUser.name || '-'} />
              <InfoItem icon={<IconMail className="h-5 w-5 text-green-600" />} label="Email" value={currentUser.email || '-'} />
              <InfoItem icon={<IconMapPin className="h-5 w-5 text-rose-600" />} label="Cabang" value={locationName || '-'} />
              <InfoItem icon={<IconPhone className="h-5 w-5 text-teal-600" />} label="Nomor Telepon" value={currentUser.phone || '-'} />
              <InfoItem icon={<IconShield className="h-5 w-5 text-purple-600" />} label="Role" value={currentUser.role} />
              <InfoItem
                icon={<IconCalendarEvent className="h-5 w-5 text-yellow-600" />}
                label="Bergabung Sejak"
                value={
                  currentUser.created_at
                    ? new Date(currentUser.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : '-'
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const InfoItem = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 border rounded-md p-4 bg-muted/30">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  </div>
);
