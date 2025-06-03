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

type AvailabilityDetailDialogProps = {
  data: Reservation;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function AvailabilityDetailDialog({ 
  data, 
  trigger, 
  open, 
  onOpenChange 
}: AvailabilityDetailDialogProps) {
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
          <DetailRow label='Waktu Pembuatan' value={formatDate(data.created_at)} />
          <DetailRow label='Nama Pemesan' value={data.name} />
          <DetailRow 
            label='Lapangan & Waktu' 
            value={
              data.fieldData && data.fieldData.length > 0 ? 
                data.fieldData.map((field, index) => (
                  <div key={index} className="mb-1">
                    <div className="font-medium">{field.fieldName}</div>
                    <div className="text-sm text-gray-600">
                      {field.times.length > 0 ? field.times.join(', ') : 'Tidak ada waktu'}
                    </div>
                  </div>
                ))
              : 'Tidak ada data lapangan'
            } 
          />

          {/* Tampilkan data tanggal */}
          <DetailRow 
            label='Tanggal Tutup' 
            value={
              data.fieldData && data.fieldData.length > 0 ? 
                data.fieldData.map((field, index) => (
                  <div key={index} className="mb-1">
                    {field.dates.length > 0 ? 
                      field.dates.map(date => formatDate(date, true)).join(', ') 
                      : 'Tidak ada tanggal'
                    }
                  </div>
                ))
              : 'Tidak ada data tanggal'
            } 
          />
          <DetailRow
            label='Status Reservasi'
            value={<Badge variant='outline' className='capitalize'>{convertStatus(data.status)}</Badge>}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
function convertStatus(status: string) {
  if (status === 'upcoming') return 'Mendatang';
  if (status === 'ongoing') return 'Berlangsung';
  if (status === 'completed') return 'Selesai';
  return status;
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