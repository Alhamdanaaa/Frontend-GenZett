'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Field } from '@/constants/data';
import {
  IconEdit,
  IconTrash,
  IconEye
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { lazy, Suspense, useState } from 'react';
import { deleteField } from '@/lib/api/field';
import { toast } from 'sonner';

const FieldDetailDialog = lazy(() =>
  import('../field-detail-dialog')
);

interface CellActionProps {
  data: Field;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
      setLoading(true);
      try {
        await deleteField(Number(data.id));
        setOpen(false);
        router.refresh();
        toast.success("Lapangan berhasil dihapus");
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message ?? 'Terjadi kesalahan saat menghapus data';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <div className="flex flex-row gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className='shadow-md'
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
              <Button className='shadow-md'
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/field/${data.id}`)}
              >
                <IconEdit className="h-4 w-4 stroke-amber-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ubah</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button className='shadow-md'
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
              >
                <IconTrash className="h-4 w-4 stroke-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hapus</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showDetail && (
        <Suspense fallback={<div>Memuat...</div>}>
          <FieldDetailDialog
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