'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { User } from '@/constants/data';

type UserDetailDialogProps = {
  data: User;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function UserDetailDialog({
  data, 
  trigger, 
  open, 
  onOpenChange 
}: UserDetailDialogProps) {
  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Detail Pengguna</DialogTitle>
          <DialogDescription>Informasi lengkap dari pengguna yang dipilih.</DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-y-3 text-sm'>
          <DetailRow label='Username' value={data.username} />
          <DetailRow label='Nama Lengkap' value={data.name} />
          <DetailRow label='Email' value={data.email} />
          <DetailRow label='Nomor Telepon' value={data.phone} />
          <DetailRow label='Dibuat Pada' value={formatDate(data.created_at)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className='flex flex-col'>
      <span className='font-medium text-muted-foreground'>{label}</span>
      <span className='text-base'>{value || '-'}</span>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
