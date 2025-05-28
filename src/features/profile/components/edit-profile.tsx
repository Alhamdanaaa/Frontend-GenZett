'use client'

import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { editProfile } from '@/lib/api/auth'
import { useEffect } from 'react'

const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nama minimal 2 karakter.' })
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^(\+62|08)\d{8,11}$/, {
      message:
        'Nomor telepon harus dimulai dengan +62 atau 08 dan terdiri dari 10-12 digit.',
    })
    .or(z.literal('')),
})

type ProfileSchema = z.infer<typeof profileSchema>

type Props = {
  name?: string
  phone?: string
}

export default function EditProfileForm({ name = '', phone = '' }: Props) {
  const router = useRouter()

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  })

  // ✅ Ambil user dari localStorage dan set ke form
  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      const user = JSON.parse(userString)
      form.reset({
        name: user.name || '',
        phone: user.phone || '',
      })
    }
  }, [form])

  const onSubmit = async (data: ProfileSchema) => {
    try {
      const res = await editProfile(data.name, data.phone)

      if (!res || res.status !== 200) {
        throw new Error('Gagal memperbarui profil')
      }

      // ✅ Update localStorage user
      const stored = localStorage.getItem('user')
      if (stored) {
        const updated = { ...JSON.parse(stored), ...data }
        localStorage.setItem('user', JSON.stringify(updated))
      }

      toast.success('Profil berhasil diperbarui')
      router.replace('/dashboard/profile')
    } catch (err: any) {
      console.error(err.response?.data || err.message)
      toast.error(err.message || 'Terjadi kesalahan')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
