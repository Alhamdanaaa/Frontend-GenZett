'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Reservation } from '@/constants/data';
import { confirmPayment } from '@/lib/api/reservation';
import { IconEdit, IconEye, IconCash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, lazy, Suspense } from 'react';
import { toast } from 'sonner';

// Lazy load the detail dialog component
const ReservationDetailDialog = lazy(() => import('../reservation-detail-dialog'));

interface CellActionProps {
  data: Reservation;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    try {
      await confirmPayment(data.reservationId);
      toast.success("Pembayaran berhasil dikonfirmasi");
      router.refresh(); // atau panggil refetch data
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };


  const isDp = data.paymentStatus === 'dp';

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Konfirmasi Pembayaran"
        description="Apakah Anda yakin ingin mengubah status pembayaran untuk reservasi ini?"
        confirmText="Bayar Sekarang"
      >
        <div className="text-sm mt-2">
          <span className="font-medium">Jumlah yang harus dibayar pengguna:</span><br />
          <span className="text-green-600 font-bold">
            Rp {Number(data.remainingPayment).toLocaleString('id-ID')}
          </span>
        </div>
      </AlertModal>


      <div className="flex flex-row gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="shadow-md"
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                disabled={!isDp}
              >
                <IconCash className="h-4 w-4 stroke-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDp ? 'Bayar' : 'Sudah dibayar'}
            </TooltipContent>
          </Tooltip>

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
            <TooltipContent>Detail</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="shadow-md"
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/reservation/${data.reservationId}`)
                }
              >
                <IconEdit className="h-4 w-4 stroke-amber-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ubah</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showDetail && (
        <Suspense fallback={<div>Loading...</div>}>
          <ReservationDetailDialog
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
