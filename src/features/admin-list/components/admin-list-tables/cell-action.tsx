'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AdminUpdateInput as Admin } from '@/constants/data';
import { deleteAdmin } from '@/lib/api/admin';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { lazy, useState,Suspense } from 'react';

// const AdminDetailDialog = lazy(() => 
//   import('../admin-list-detail-dialog')
// );

interface CellActionProps {
  data: Admin;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const [showDetail, setShowDetail] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteAdmin(Number(data.id)); // cukup panggil dan biarkan throw jika error
      setOpen(false);
      router.refresh(); // Refresh data
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menghapus data');
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
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button className='shadow-md'
                variant="outline"
                size="sm"
                onClick={() => setShowDetail(true)}
              >
                <IconEye className="h-4 w-4 stroke-blue-600" /> */}
                {/* <IconListDetails className="h-4 w-4 stroke-blue-600" /> */}
              {/* </Button>
            </TooltipTrigger>
            <TooltipContent>Detail</TooltipContent>
          </Tooltip> */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button className='shadow-md'
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/admin/${data.id}`)}
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

      {/* {showDetail && (
        <Suspense fallback={<div>Loading...</div>}>
          <AdminDetailDialog
            trigger={<div style={{display: 'none'}} />}
            open={showDetail}
            onOpenChange={setShowDetail}
            data={data}
          />
        </Suspense>
      )} */}
    </>
  );
};
