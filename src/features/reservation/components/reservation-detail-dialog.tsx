'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/constants/data';

type ReservationDetailDialogProps = {
  data: Reservation;
  trigger: React.ReactNode;
};

export default function ReservationDetailDialog({ data, trigger }: ReservationDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Detail Reservasi</DialogTitle>
          <DialogDescription>Informasi lengkap dari reservasi yang dipilih.</DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-y-3 text-sm'>
          <DetailRow label='ID Reservasi' value={String(data.reservationId)} />
          <DetailRow label='Waktu Pemesanan' value={data.createTime} />
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
          <DetailRow label='Dibuat Pada' value={formatDate(data.created_at)} />
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
}
