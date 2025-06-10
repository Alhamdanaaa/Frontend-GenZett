'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Reservation } from '@/constants/data';
import { refundCancellation } from '@/lib/api/cancellation';
import { IconReceiptRefund, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, lazy, Suspense } from 'react';
import { toast } from 'sonner';

// Lazy load detail dialog
const CancellationDetailDialog = lazy(() => import('../cancellation-detail-dialog'));

interface CellActionProps {
  data: Reservation;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const router = useRouter();

  const isRefundable = data.paymentStatus === 'waiting' && data.cancellation;

  const handleRefund = async () => {
    setLoading(true);
    try {
      await refundCancellation(data.reservationId);
      toast.success('Reservasi berhasil dibatalkan dan refund telah diproses.');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Gagal memproses refund.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleRefund}
        loading={loading}
        title="Konfirmasi Refund"
        description="Lakukan refund untuk reservasi ini?"
        confirmText="Refund Selesai"
      >
        {data.cancellation ? (
          <div className="text-sm mt-2 space-y-2">
            <div>
              <span className="font-medium">Jumlah Refund:</span><br />
              <span className="text-green-600 font-bold">
                Rp {Number(data.total/2).toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <span className="font-medium">Platform Pembayaran:</span><br />
              <span>{data.cancellation.paymentPlatform}</span>
            </div>
            <div>
              <span className="font-medium">Atas Nama:</span><br />
              <span>{data.cancellation.accountName}</span>
            </div>
            <div>
              <span className="font-medium">No. Rekening:</span><br />
              <span>{data.cancellation.accountNumber}</span>
            </div>
            <div>
              <span className="font-medium">Alasan Pembatalan:</span><br />
              <span>{data.cancellation.reason}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">Data refund tidak tersedia.</p>
        )}
      </AlertModal>

      <div className="flex flex-row gap-2">
        {isRefundable ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="shadow-md"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(true)}
                >
                  <IconReceiptRefund className="h-4 w-4 stroke-green-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Proses Refund</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="shadow-md"
                variant="outline"
                size="sm"
                onClick={() => setShowDetail(true)}
              >
                <IconEye className="h-4 w-4 stroke-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detail Refund</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showDetail && (
        <Suspense fallback={<div>Memuat...</div>}>
          <CancellationDetailDialog
            data={data}
            trigger={<div style={{ display: 'none' }} />}
            open={showDetail}
            onOpenChange={setShowDetail}
          />
        </Suspense>
      )}
    </>
  );
};
