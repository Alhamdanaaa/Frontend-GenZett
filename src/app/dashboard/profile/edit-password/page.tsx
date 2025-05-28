'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { changePassword } from '@/lib/api/auth'

const passwordSchema = z
  .object({
    oldPassword: z.string().min(8, 'Password lama minimal 8 karakter'),
    newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })

export default function EditPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setFormErrors({
      ...formErrors,
      [e.target.name]: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = passwordSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: typeof formErrors = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof formData
        fieldErrors[field] = err.message
      })
      setFormErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
        await changePassword(formData.oldPassword, formData.newPassword)
        toast.success('Password berhasil diubah')
        router.push('/dashboard/profile')
    } catch (err: any) {
        toast.error(err.message || 'Terjadi kesalahan')
    } finally {
        setLoading(false)
    }
}

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ubah Password</h2>
        <Separator className="mb-6" />
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Password Lama</Label>
            <Input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
            />
            {formErrors.oldPassword && (
              <p className="text-sm text-red-500 mt-1">{formErrors.oldPassword}</p>
            )}
          </div>
          <div>
            <Label>Password Baru</Label>
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            {formErrors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{formErrors.newPassword}</p>
            )}
          </div>
          <div>
            <Label>Konfirmasi Password Baru</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/profile')}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
