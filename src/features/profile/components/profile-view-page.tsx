// import { UserProfile } from '@clerk/nextjs';

// export default function ProfileViewPage() {
//   return (
//     <div className='flex w-full flex-col p-4'>
//       <UserProfile />
//     </div>
//   );
// }

//   useEffect(() => {
  //   fetch('/api/me')
  //     .then((res) => res.json())
  //     .then(setUser);
  // }, []);
'use client';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  IconMail,
  IconUser,
  IconCalendarEvent,
  IconShield,
  IconPhone,
  IconMapPin
} from '@tabler/icons-react';

export default function ProfileViewPage() {
  const { user } = useUser();

  if (!user) return <div className="w-full p-6">Memuat...</div>;

  return (
    <div className="w-full px-6 py-10">
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-semibold">
                {user.username || 'Tanpa Nama'}
              </CardTitle>
              <p className="text-muted-foreground text-sm">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/user'}>Edit Profil</Button>
            <Button variant="secondary">Ubah Password</Button>
            <Button variant="destructive" onClick={() => window.location.href = '/sign-out'}>Keluar</Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Informasi Akun</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                icon={<IconUser className="h-5 w-5 text-blue-600" />}
                label="Nama Lengkap"
                value={user.fullName || '-'}
              />
              <InfoItem
                icon={<IconMail className="h-5 w-5 text-green-600" />}
                label="Email"
                value={user.primaryEmailAddress?.emailAddress || '-'}
              />
              <InfoItem
                icon={<IconPhone className="h-5 w-5 text-teal-600" />}
                label="Nomor Telepon"
                value={user.phoneNumbers?.[0]?.phoneNumber || '-'}
              />
              <InfoItem
                icon={<IconMapPin className="h-5 w-5 text-rose-600" />}
                label="Cabang"
                value={String(user.publicMetadata.branch || '-')}
              />
              <InfoItem
                icon={<IconShield className="h-5 w-5 text-purple-600" />}
                label="Role"
                value={String(user.publicMetadata.role || 'admin')}
              />
              <InfoItem
                icon={<IconCalendarEvent className="h-5 w-5 text-yellow-600" />}
                label="Bergabung Sejak"
                value={
                  user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('id-ID', {
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

// Komponen reusable untuk setiap info
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
