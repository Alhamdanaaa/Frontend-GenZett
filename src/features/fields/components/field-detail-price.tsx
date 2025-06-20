'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';;
import { getFieldPrice } from '@/lib/api/field';

type FieldPriceDialogProps = {
  fieldId: number | string;
  trigger: React.ReactNode;
};

type Price = {
  time: string;
  price: number;
};

export default function FieldPriceDialog({ fieldId, trigger }: FieldPriceDialogProps) {
  const [open, setOpen] = useState(false);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await getFieldPrice(Number(fieldId));
        setPrices(res);
      } catch (error) {
        console.error('Gagal mengambil harga lapangan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [fieldId, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Harga per Jam</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-gray-500">Memuat harga...</p>
        ) : prices.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto">
            {prices.map((item, idx) => (
              <div
                key={idx}
                className="bg-muted p-2 rounded text-sm flex justify-between items-center"
              >
                <span className="text-muted-foreground">{item.time.slice(0, 5)}</span>
                <span className="font-medium">Rp {item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Tidak ada data harga.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
