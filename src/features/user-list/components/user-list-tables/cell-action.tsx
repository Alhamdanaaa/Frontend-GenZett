'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User } from '@/constants/data';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { lazy, Suspense, useState } from 'react';

const UserDetailDialog = lazy(() => 
  import('../user-detail-dialog')
);

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

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
                {/* <IconListDetails className="h-4 w-4 stroke-blue-600" /> */}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detail</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button className='shadow-md'
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/user/${data.userId}`)}
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
        <Suspense fallback={<div>Loading...</div>}>
          <UserDetailDialog
            data={data}
            trigger={<div style={{display: 'none'}} />}
            open={showDetail}
            onOpenChange={setShowDetail}
          />
        </Suspense>
      )}
    </>
  );
};
