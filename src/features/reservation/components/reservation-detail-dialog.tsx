'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Reservation } from '@/constants/data';

type ReservationDetailDialogProps = {
  data: Reservation;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ReservationDetailDialog({ 
  data, 
  trigger, 
  open, 
  onOpenChange 
}: ReservationDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Detail Reservasi</DialogTitle>
          <DialogDescription>Informasi lengkap dari reservasi yang dipilih.</DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-y-3 text-sm'>
          <DetailRow label='Waktu Pemesanan' value={parseCustomDate(data.createTime)} />
          <DetailRow label='Nama Pemesan' value={data.name} />
          <DetailRow label='Waktu Lapangan' value={data.fieldTime} />
          <DetailRow label='Tanggal Main' value={formatDate(data.date, true)} />
          <DetailRow label='Total Pembayaran' value={formatCurrency(data.totalPayment)} />
          <DetailRow label='Sisa Pembayaran' value={formatCurrency(data.remainingPayment)} />
          <DetailRow
            label='Status Pembayaran'
            value={<Badge className='capitalize'>{data.paymentStatus}</Badge>}
          />
          <DetailRow
            label='Status Reservasi'
            value={<Badge variant='outline' className='capitalize'>{data.status}</Badge>}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex flex-col'>
      <span className='font-medium text-muted-foreground'>{label}</span>
      <span className='text-base'>{value}</span>
    </div>
  );
}

function formatDate(dateStr: string, onlyDate = false) {
  const date = new Date(dateStr);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(onlyDate ? {} : { hour: '2-digit', minute: '2-digit' })
  });
}

function parseCustomDate(dateStr: string, onlyDate = false) {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  const fullYear = year < 100 ? 2000 + year : year; // 25 → 2025

  const date = new Date(fullYear, month - 1, day, hours, minutes, seconds);

  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...(onlyDate ? {} : { hour: '2-digit', minute: '2-digit' })
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
}