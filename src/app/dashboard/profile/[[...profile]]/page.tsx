import ProfileViewPage from '@/features/profile/components/profile-view-page';
import { getUserFromServer } from '@/hooks/use-user';

export default async function ProfilePage() {
  const user = await getUserFromServer();

  // Konversi locationId jika ada
  const formattedUser = user
    ? {
        ...user,
        locationId: user.locationId ? String(user.locationId) : undefined,
      }
    : null;

  return <ProfileViewPage user={formattedUser} />;
}
