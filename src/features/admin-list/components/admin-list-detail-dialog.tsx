'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { AdminOutput as Admin } from '@/constants/data';

type AdminDetailDialogProps = {
  data: Admin;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function AdminDetailDialog({
  data, 
  trigger, 
  open, 
  onOpenChange 
}: AdminDetailDialogProps) {
  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Detail Admin</DialogTitle>
          <DialogDescription>Informasi lengkap dari admin yang dipilih.</DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-y-3 text-sm'>
          {/* <DetailRow label='Username' value={data.username} /> */}
          <DetailRow label='Nama Lengkap' value={data.name} />
          <DetailRow label='Email' value={data.email} />
          <DetailRow label='Nomor Telepon' value={data.phone} />
          <DetailRow label='Cabang' value={String(data.location)} />
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