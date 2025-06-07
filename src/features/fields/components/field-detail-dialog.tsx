'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field } from '@/constants/data';
import FieldPriceDialog from './field-detail-price';
import { IconCoin } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

type FieldDetailDialogProps = {
  data: Field;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function FieldDetailDialog({
  data,
  trigger,
  open,
  onOpenChange,
}: FieldDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Lapangan</DialogTitle>
          <DialogDescription>
            Informasi lengkap dari lapangan yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-y-3 text-sm">
          <DetailRow label="Nama Lapangan" value={data.name} />
          <DetailRow label="Lokasi Cabang" value={data.location} />
          <DetailRow label="Cabang Olahraga" value={data.sport} />
          <DetailRow label="Deskripsi" value={data.description} />
        </div>
        <div className="mt-4">
          <FieldPriceDialog
            fieldId={data.id}
            trigger={
              <Button
                type="button"
              >
                <IconCoin className="h-4 w-4" />
                Lihat Harga
              </Button>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="text-base">{value || '-'}</span>
    </div>
  );
}
