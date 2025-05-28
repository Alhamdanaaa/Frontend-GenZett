import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import EditProfileFormClient from '@/features/profile/components/edit-profile'
import { getUserFromServer } from '@/hooks/use-user'

export default async function EditProfilePage() {
  const user = await getUserFromServer()

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profil</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          <EditProfileFormClient
            name={user?.name}
            phone={user?.phone}
          />
        </CardContent>
      </Card>
    </div>
  )
}
