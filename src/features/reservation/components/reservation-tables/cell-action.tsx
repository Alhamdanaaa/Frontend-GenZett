'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Reservation } from '@/constants/data';
import { IconEdit, IconDotsVertical, IconTrash, IconListDetails } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, lazy, Suspense } from 'react';

// Lazy load the detail dialog component
const ReservationDetailDialog = lazy(() => 
  import('../reservation-detail-dialog')
);

interface CellActionProps {
  data: Reservation;
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
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowDetail(true);
            }}
          >
            <IconListDetails className='mr-2 h-4 w-4' /> Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/dashboard/reservation/${data.reservationId}`)
            }
          >
            <IconEdit className='mr-2 h-4 w-4' /> Ubah
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Only load detail dialog when needed */}
      {showDetail && (
        <Suspense fallback={<div>Loading...</div>}>
          <ReservationDetailDialog
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